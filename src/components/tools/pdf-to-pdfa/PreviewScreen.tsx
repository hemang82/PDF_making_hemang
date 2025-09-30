'use client';

import Image from 'next/image';
import { type JSX, useEffect, useState } from 'react';
import { type Accept, useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';

import ActionSidebar from '@/components/tool/ActionSidebar';
import AddFileSection from '@/components/tool/AddFileSection';
import EmptyPdfPlaceholder from '@/components/tool/EmptyPdfPlaceholder';
import ProcessingOverlay from '@/components/tool/ProcessingOverlay';
import SidebarToggleButton from '@/components/tool/SidebarToggleButton';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { type UploadedFile, useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Conformance level data
const CONFORMANCE_LEVELS = {
  'pdfa-1a': {
    label: 'PDF/A-1a',
    description: 'Based on a PDF 1.4. Level A (accessible) conformance with additional standard requirements.',
    features: [
      'Language specification',
      'Hierarchical document structure',
      'Tagged text spans and descriptive text for images and symbols',
      'Character mappings to Unicode',
    ],
  },
  'pdfa-1b': {
    label: 'PDF/A-1b',
    description: 'Based on a PDF 1.4. Level B (basic) conformance with mandatory requirements.',
    features: [
      'Include Embed fonts',
      'Include Color Management guides',
      'Include Metadata',
      'Also a list of forbidden elements',
    ],
  },
  'pdfa-2a': {
    label: 'PDF/A-2a',
    description: 'Based on a PDF 1.7. Level A (accessible) conformance with additional standard requirements.',
    features: [
      'Language specification',
      'Hierarchical document structure',
      'Tagged text spans and descriptive text for images and symbols',
      'Character mappings to Unicode',
      'Digital signatures support',
    ],
  },
  'pdfa-2b': {
    label: 'PDF/A-2b',
    description: 'Based on a PDF 1.7. Level B (basic) conformance with mandatory requirements.',
    features: [
      'Include Embed fonts',
      'Include Color Management guides',
      'Include Metadata',
      'Also a list of forbidden elements',
      'Digital signatures support',
    ],
  },
  'pdfa-2u': {
    label: 'PDF/A-2u',
    description: 'Based on a PDF 1.7. Level U (Unicode) conformance with Unicode requirements.',
    features: [
      'Include Embed fonts',
      'Include Color Management guides',
      'Include Metadata',
      'Unicode character mappings',
      'Digital signatures support',
    ],
  },
  'pdfa-3a': {
    label: 'PDF/A-3a',
    description: 'Based on a PDF 1.7. Level A (accessible) conformance with file attachment support.',
    features: [
      'Language specification',
      'Hierarchical document structure',
      'Tagged text spans and descriptive text for images and symbols',
      'Character mappings to Unicode',
      'File attachments allowed',
    ],
  },
  'pdfa-3b': {
    label: 'PDF/A-3b',
    description: 'Based on a PDF 1.7. Level B (basic) conformance with file attachment support.',
    features: [
      'Include Embed fonts',
      'Include Color Management guides',
      'Include Metadata',
      'Also a list of forbidden elements',
      'File attachments allowed',
    ],
  },
  'pdfa-3u': {
    label: 'PDF/A-3u',
    description: 'Based on a PDF 1.7. Level U (Unicode) conformance with file attachment support.',
    features: [
      'Include Embed fonts',
      'Include Color Management guides',
      'Include Metadata',
      'Unicode character mappings',
      'File attachments allowed',
    ],
  },
};

// PDF Item Component
interface PdfItemProps {
  file: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  isDragging?: boolean;
}

const PdfItem = ({ file, index, onRemove, onRotate }: PdfItemProps) => {
  const removeAndRotateIconBtnClass =
    'bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full opacity-100 transition-all duration-200 group-hover:opacity-100 hover:scale-110 lg:opacity-0';

  return (
    <div className='group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] items-center justify-center rounded-md px-[43px] py-[39px] hover:border'>
      {/* Remove & Rotate Button */}
      <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0'>
        {/* Remove Button */}
        <button
          className={removeAndRotateIconBtnClass}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
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
          className={removeAndRotateIconBtnClass}
          onClick={(e) => {
            e.stopPropagation();
            onRotate(file.id);
          }}
          aria-label='Rotate file'
        >
          <Image
            src='/images/pdf-tools/white-rotate-icon.svg'
            alt='Rotate Icon'
            width={16}
            height={16}
            className='h-auto w-auto'
            style={{ transform: `rotate(${file.rotation || 0}deg)` }}
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
      <div className='transition-all' style={{ transform: `rotate(${file.rotation || 0}deg)` }}>
        <div className='relative flex items-center justify-center overflow-hidden'>
          <Document file={file.previewFileUrl} className='flex items-center justify-center'>
            <Page
              pageNumber={1}
              width={80.5}
              height={113.86}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className='shadow-sm'
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

interface PreviewScreenProps {
  heading: string;
  buttonLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
  fileNameAddOn: string;
  tool: string;
  toolName: string;
}

const PreviewScreen = ({
  heading,
  buttonLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
  fileNameAddOn,
  tool,
  toolName,
}: PreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const rotateUploadedFile = useCustomPdfToolStore((state) => state.rotateUploadedFile);
  const updateFileData = useCustomPdfToolStore((state) => state.updateFileData);
  const setILovePdfDownloadInfo = useCustomPdfToolStore((state) => state.setILovePdfDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const [conformance, setConformance] = useState<keyof typeof CONFORMANCE_LEVELS>('pdfa-2b');
  const [allowDowngrade, setAllowDowngrade] = useState(true);

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

  const initializeTask = async () => {
    try {
      const response = await fetch(`/api/ilovepdf/start?tool=${tool}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} - Initialize Task Error]:`, errorData?.error);
        toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
        return;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Page InitializeTask Error]:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
    }
  };

  const uploadTask = async (task: string, server: string) => {
    try {
      const uploadPromises = uploadedFiles.map(async (fileItem) => {
        const response = await fetch('/api/ilovepdf/upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData();
            formData.append('file', fileItem.file);
            formData.append('task', task);
            formData.append('server', server);
            return formData;
          })(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`[${toolName} Page InitializeTask Error]:`, errorData?.error);
          toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
          throw new Error('Upload failed');
        }

        const data = await response.json();

        // Update state
        updateFileData(fileItem.id, {
          server_filename: data.server_filename,
        });
      });

      // Wait for all uploads and return the updated files
      await Promise.all(uploadPromises);
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Upload files error:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
      throw error;
    }
  };

  const processTask = async (task: string, server: string) => {
    const currentFiles = useCustomPdfToolStore.getState().uploadedFiles;

    const filePayload = currentFiles.map((f) => ({
      server_filename: f.server_filename,
      filename: `pdfmaking_${fileNameAddOn}_${f.name}`,
      rotate: f.rotation,
    }));

    try {
      const response = await fetch('/api/ilovepdf/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server,
          task,
          tool,
          files: filePayload,
          conformance: conformance,
          allow_downgrade: allowDowngrade,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} Process error:`, errorData?.error);
        toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
        throw new Error('Process failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Process error:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
      throw error;
    }
  };

  // Handle process
  const handleProcess = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Initialize the task
      setProcessingMessage('Initializing task...');
      const taskData = await initializeTask();

      if (!taskData.task || !taskData.server) {
        throw new Error('Failed to initialize task');
      }

      // Step 2: Upload files
      setProcessingMessage('Uploading your files...');

      await uploadTask(taskData.task, taskData.server);

      // Step 3: Process files
      setProcessingMessage('Processing your files...');

      const processResult = await processTask(taskData.task, taskData.server);

      // Step 4: Handle successful processing
      if (processResult) {
        setProcessingMessage('Finalizing files...');
        setILovePdfDownloadInfo({
          ...processResult,
          task: taskData.task,
          server: taskData.server,
        });
        setScreenType('download');
      } else {
        throw new Error('Failed to process files');
      }
    } catch (error) {
      console.error(`${toolName} error:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${toolName} PDFs. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const selectedConformanceData = CONFORMANCE_LEVELS[conformance];
  const btnDisabledCondition = uploadedFiles.length === 0 || isProcessing;

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
                <PdfItem
                  key={file.id}
                  file={file}
                  index={index}
                  onRemove={removeUploadedFile}
                  onRotate={rotateUploadedFile}
                />
              ))}
            </div>

            {uploadedFiles.length === 0 && <EmptyPdfPlaceholder />}
          </div>

          {/* Add File Section */}
          <AddFileSection fileCount={uploadedFiles.length} onUpload={open} isShowSortFilesButton={true} />
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
          <p className='font-inter text-brand-slate-600 mb-8 rounded-[10px] bg-white p-[21px] text-[16px]/[23px] font-normal'>
            PDF/A is an ISO-standardized version of the Portable Document Format (PDF) specialized for use in the
            archiving and long-term preservation of electronic documents.
          </p>

          <p className='font-inter mb-6 text-[16px]/[23px] font-normal text-white'>
            Choose with what conformance level you want to convert your document:
          </p>

          {/* Conformance Level Dropdown */}
          <div className='mb-6'>
            <label htmlFor='conformance-level' className='mb-3 block text-[18px] font-bold text-white'>
              Set the PDF/A conformance level
            </label>
            <select
              id='conformance-level'
              value={conformance}
              onChange={(e) => setConformance(e.target.value as keyof typeof CONFORMANCE_LEVELS)}
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              {Object.entries(CONFORMANCE_LEVELS).map(([value, data]) => (
                <option key={value} value={value}>
                  {data.label}
                </option>
              ))}
            </select>
          </div>

          {/* Conformance Level Description */}
          <div className='mb-6 rounded-[10px] bg-white p-[21px]'>
            <p className='text-brand-slate-600 mb-3 text-[16px]/[23px] font-normal'>
              {selectedConformanceData.description}
            </p>
            <ul className='text-brand-slate-600 text-[14px]/[20px] font-normal'>
              {selectedConformanceData.features.map((feature, index) => (
                <li key={index} className='mb-1 flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allow Downgrade Checkbox */}
          <div className='mb-6'>
            <label htmlFor='allowDowngrade' className='flex cursor-pointer items-start'>
              <div className='relative mt-1'>
                <input
                  id='allowDowngrade'
                  type='checkbox'
                  checked={allowDowngrade}
                  onChange={(e) => setAllowDowngrade(e.target.checked)}
                  className='sr-only'
                  aria-labelledby='allowDowngrade-label'
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                    allowDowngrade ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
                  }`}
                >
                  {allowDowngrade && (
                    <svg className='h-3 w-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className='ml-3'>
                <span className='text-[16px] font-medium text-white'>Allow Downgrade of PDF/A Compliance Level</span>
                <p className='mt-1 text-[14px] text-gray-200'>
                  {`In order to convert to PDF/A, when certain elements are found in the original PDF, it's possible that
                  a conformance downgrade is needed to be able to perform the conversion.`}
                </p>
              </div>
            </label>
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
