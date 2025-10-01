'use client';

import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { toast } from 'sonner';

import ActionSidebar from '@/components/tool/ActionSidebar';
import AddFileSection from '@/components/tool/AddFileSection';
import EmptyPdfPlaceholder from '@/components/tool/EmptyPdfPlaceholder';
import ProcessingOverlay from '@/components/tool/ProcessingOverlay';
import SidebarToggleButton from '@/components/tool/SidebarToggleButton';
import { OCRSelection } from '@/components/tools/pdf-to-office/OCRSelection';
import { PdfItem } from '@/components/tools/pdf-to-office/PdfItem';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';
import { type ConversionOptions } from '@/types/conversion';
import { PDFConversionService } from '@/utils/pdfConversion';

interface PreviewScreenProps {
  heading: string;
  buttonLabel: string;
  targetFormat: ConversionOptions['targetFormat'];
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
  showOCROptions?: boolean;
}

const PreviewScreen = ({
  heading,
  buttonLabel,
  targetFormat,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
  showOCROptions = true,
}: PreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const setDownloadInfo = useCustomPdfToolStore((state) => state.setDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const [selectedOCRType, setSelectedOCRType] = useState<'no-ocr' | 'ocr'>('no-ocr');
  const [selectedOCRLang, setSelectedOCRLang] = useState<string>('en-US');

  // This should come from your auth store/context
  // const [isUserPremium, setIsUserPremium] = useState(true);
  // const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

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

  // Responsive Sidebar Toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle PDF conversion
  const handleProcess = async () => {
    setIsProcessing(true);
    const formatName = PDFConversionService.getFormatDisplayName(targetFormat);
    setProcessingMessage(`Converting PDF to ${formatName}...`);

    try {
      const firstFile = uploadedFiles[0];
      if (!firstFile) {
        throw new Error('No file selected');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', firstFile.file);
      formData.append('targetFormat', targetFormat);
      formData.append('ocrEnabled', selectedOCRType === 'ocr' ? 'true' : 'false');
      formData.append('ocrLang', selectedOCRLang);

      // Call the API endpoint
      const response = await fetch('/api/adobe/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const { downloadUri, fileName } = await response.json();

      if (setDownloadInfo) {
        setDownloadInfo({
          processedFileUrl: downloadUri,
          processedFileName: fileName,
        });
      }

      // Navigate to download screen
      setScreenType('download');
      toast.success(`PDF converted to ${formatName} successfully!`);
    } catch (error) {
      console.error('PDF conversion error:', error);
      toast.error(error instanceof Error ? error.message : `Failed to convert PDF to ${formatName}. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const canProcess = uploadedFiles.length > 0 && !isProcessing;

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
                <PdfItem key={file.id} file={file} index={index} onRemove={removeUploadedFile} />
              ))}
            </div>

            {uploadedFiles.length === 0 && <EmptyPdfPlaceholder />}
          </div>

          {/* Add File Section */}
          <AddFileSection fileCount={uploadedFiles.length} onUpload={open} isShowSortFilesButton={false} />
        </div>

        {/* Right Side - Action Sidebar */}
        <ActionSidebar
          heading={heading}
          buttonLabel={buttonLabel}
          isProcessing={isProcessing}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onProcess={handleProcess}
          canProcess={canProcess}
          fileCount={uploadedFiles.length}
        >
          <div className='space-y-6'>
            {/* Description */}
            <div className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base font-normal'>
              {showOCROptions ? (
                <p>Choose OCR for scanned PDFs or No OCR for text-based PDFs.</p>
              ) : (
                <p>Convert your PDF files to {PDFConversionService.getFormatDisplayName(targetFormat)} with ease.</p>
              )}
            </div>

            {/* OCR Selection */}
            {showOCROptions && (
              <OCRSelection
                selectedOCRType={selectedOCRType}
                onOCRTypeChange={setSelectedOCRType}
                selectedOCRLang={selectedOCRLang}
                onOCRLangChange={setSelectedOCRLang}
                isUserPremium={true}
                targetFormat={targetFormat}
              />
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
