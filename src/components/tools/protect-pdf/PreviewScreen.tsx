'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { toast } from 'sonner';

import ActionSidebar from '@/components/tool/ActionSidebar';
import AddFileSection from '@/components/tool/AddFileSection';
import EmptyPdfPlaceholder from '@/components/tool/EmptyPdfPlaceholder';
import ProcessingOverlay from '@/components/tool/ProcessingOverlay';
import SidebarToggleButton from '@/components/tool/SidebarToggleButton';
import UnlockPdfThumbnail from '@/components/tools/office-to-pdf/PdfThumbnail';
import PdfThumbnail from '@/components/tools/protect-pdf/PdfThumbnail';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

interface PreviewScreenProps {
  heading: string;
  buttonLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
  mode?: 'protect' | 'unlock'; // Add mode prop to distinguish between protect and unlock
}

const PreviewScreen = ({
  heading,
  buttonLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
  mode = 'protect',
}: PreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const rotateUploadedFile = useCustomPdfToolStore((state) => state.rotateUploadedFile);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const setProcessedFileName = useCustomPdfToolStore((state) => state.setProcessedFileName);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Custom hook to handle file upload logic
  const { onDrop } = useFileUploadHandler({
    isCheckPdfPasswordProtected,
    filesLimit,
    maxFileSizePerTaskInBytes,
    accept,
  });

  // File upload dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Combine both accepted and rejected files for our custom validation
      const allFiles = [...acceptedFiles, ...rejectedFiles.map((rejection) => rejection.file)];

      // Call our custom handler with all files (let our validation handle filtering)
      onDrop(allFiles);
    },
    accept,
    multiple,
    noClick: true,
    noKeyboard: true,
  });

  // For Responsive Sidebar for Mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Password validation
  useEffect(() => {
    if (mode === 'protect' && password && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword, mode]);

  // Create data_dict for API
  const createDataDict = () => {
    const dataDict: Record<string, number> = {};

    uploadedFiles.forEach((file) => {
      dataDict[file.name] = file.rotation || 0;
    });

    return dataDict;
  };

  // Handle process
  const handleProcess = async () => {
    // Validate inputs
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one PDF file');
      return;
    }

    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    if (mode === 'protect' && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (mode === 'protect' && password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsProcessing(true);
    setProcessingMessage('Processing your files...');

    try {
      // Create FormData
      const formData = new FormData();

      // Add files to FormData
      uploadedFiles.forEach((fileItem) => {
        formData.append('file', fileItem.file);
      });

      // Add password to FormData
      formData.append('password', password);

      // Add data_dict as JSON string
      const dataDict = createDataDict();
      formData.append('data_dict', JSON.stringify(dataDict));

      // Determine API endpoint based on mode
      const endpoint = mode === 'protect' ? 'protected-pdf' : 'unlock-protected-pdf';

      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store the filename for download
        if (setProcessedFileName) {
          setProcessedFileName(result.data.file);
        }

        // Navigate to download screen (optional)
        setScreenType('download');
      } else {
        throw new Error(result.message || 'Failed to process PDF');
      }

      const successMessage =
        mode === 'protect' ? 'PDF password protection applied successfully!' : 'PDF unlocked successfully!';

      toast.success(successMessage);

      // Reset password fields after successful processing
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        mode === 'protect'
          ? `Error protecting PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
          : `Error unlocking PDF: ${error instanceof Error ? error.message : 'Unknown error'}`;

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const btnDisabledCondition =
    isProcessing || !password || (mode === 'protect' && (!confirmPassword || password !== confirmPassword));

  return (
    <>
      <div className='flex h-full'>
        {/* Left Side - PDF Preview with Drag & Drop */}
        <div
          {...getRootProps({
            className:
              'relative flex h-[calc(100vh-145px)] flex-1 justify-center overflow-auto px-[37.7px] pt-[50px] xl:pt-[100px]',
          })}
        >
          <input {...getInputProps()} aria-label='File input' />

          {/* Drag & Drop Overlay */}
          {isDragActive && (
            <div className='bg-brand-primary/20 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
              <div className='flex flex-col items-center'>
                {/* Upload Icon */}
                <div className='relative mb-4 h-[60px] w-[60px] xl:h-[80px] xl:w-[80px]'>
                  <Image src='/images/pdf-tools/cloud-download-icon.svg' alt='Upload Icon' fill />
                </div>

                {/* Drop Text */}
                <p className='font-inter text-brand-primary text-xl font-semibold xl:text-2xl'>Drop files here</p>
                <p className='font-inter text-brand-slate-600 mt-2 text-base font-normal xl:text-lg'>
                  Release to upload your files
                </p>
              </div>
            </div>
          )}

          {/* File Grid */}
          <div className='mb-[50px] h-fit w-full lg:mx-[75px]'>
            <div className='flex flex-col items-center justify-center gap-[11.37px] md:flex-row md:flex-wrap'>
              {uploadedFiles.map((file, index) => (
                <div
                  key={file.id}
                  className='group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] items-center justify-center rounded-md px-[43px] py-[39px] hover:border'
                >
                  {/* Remove & Rotate Button */}
                  <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0'>
                    {/* Remove Button */}
                    <button
                      className='bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full opacity-100 transition-all duration-200 group-hover:opacity-100 hover:scale-110 lg:opacity-0'
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUploadedFile(file.id);
                      }}
                      aria-label='Remove file'
                    >
                      <Image
                        src='/images/pdf-tools/white-close-icon.svg'
                        alt='Close Icon'
                        width={16}
                        height={16}
                        className='h-auto w-auto'
                      />
                    </button>

                    {/* Rotate Button */}
                    <button
                      className='bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full opacity-100 transition-all duration-200 group-hover:opacity-100 hover:scale-110 lg:opacity-0'
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateUploadedFile(file.id);
                      }}
                      aria-label='Rotate file'
                    >
                      <Image
                        src='/images/pdf-tools/white-rotate-icon.svg'
                        alt='Rotate Icon'
                        width={16}
                        height={16}
                        className='h-auto w-auto'
                        style={{ transform: `rotate(${file.rotation}deg)` }}
                      />
                    </button>
                  </div>

                  {/* File Number Badge */}
                  <div className='bg-brand-primary absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'>
                    {index + 1}
                  </div>

                  {/* File Name Badge */}
                  <div className='bg-brand-primary absolute right-3 bottom-2 left-3 z-10 flex h-6 items-center justify-center rounded-[5px] text-[10px] font-bold text-white'>
                    {file.name.length > 18 ? `${file.name.substring(0, 18)}...` : file.name}
                  </div>

                  {/* PDF Thumbnail */}
                  <div style={{ transform: `rotate(${file.rotation}deg)` }}>
                    {mode === 'protect' ? <PdfThumbnail file={file.file} /> : <UnlockPdfThumbnail file={file.file} />}
                  </div>
                </div>
              ))}
            </div>

            {uploadedFiles.length === 0 && <EmptyPdfPlaceholder />}
          </div>

          {/* Add File Section */}
          {uploadedFiles.length === 0 && (
            <AddFileSection fileCount={uploadedFiles.length} onUpload={open} isShowSortFilesButton={false} />
          )}
        </div>

        {/* Right Side - Action Sidebar */}
        <ActionSidebar
          heading={heading}
          buttonLabel={buttonLabel}
          isProcessing={isProcessing}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onProcess={handleProcess}
          canProcess={!btnDisabledCondition}
          fileCount={uploadedFiles.length}
        >
          <p className='mb-[30px] text-center text-sm text-white/90 lg:text-base'>
            {mode === 'protect'
              ? 'Set a password to protect your PDF file'
              : 'Enter the password to unlock your PDF file'}
          </p>

          {/* Password Input Fields */}
          <div className='w-full space-y-4'>
            {/* Password Field */}
            <div className='relative'>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'protect' ? 'Type password' : 'Enter password'}
                  className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none lg:text-base'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field - Only for protect mode */}
            {mode === 'protect' && (
              <div className='relative'>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Repeat password'
                    className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none lg:text-base'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700'
                  >
                    {showConfirmPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {passwordError && <div className='text-sm font-medium text-red-200'>{passwordError}</div>}

            {/* Password Requirements */}
            {mode === 'protect' && (
              <div className='text-center text-xs text-white/70 lg:text-left'>
                Password must be at least 6 characters long
              </div>
            )}
          </div>
        </ActionSidebar>
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay isVisible={isProcessing} message={processingMessage} />

      {/* Mobile Sidebar Toggle Button */}
      <SidebarToggleButton
        isSidebarOpen={isSidebarOpen}
        onToggle={() => {
          if (uploadedFiles.length === 0) {
            toast.error('Please upload at least one PDF file to proceed.');
            return;
          }
          setIsSidebarOpen(!isSidebarOpen);
        }}
      />
    </>
  );
};

export default PreviewScreen;
