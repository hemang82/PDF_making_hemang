'use client';

import { RotateCcw, RotateCw } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';

import ActionSidebar from '@/components/tool/ActionSidebar';
import AddFileSection from '@/components/tool/AddFileSection';
import EmptyPdfPlaceholder from '@/components/tool/EmptyPdfPlaceholder';
import ProcessingOverlay from '@/components/tool/ProcessingOverlay';
import SidebarToggleButton from '@/components/tool/SidebarToggleButton';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { useCustomPdfToolStore, type UploadedFile } from '@/store/useCustomPdfToolStore';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
        {/* <button
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
        </button> */}
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

      {/* Pages Count */}
      {/* {numPages && numPages > 1 && (
        <div className='absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-xs text-white'>
          {numPages} pages
        </div>
      )} */}
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

// Rotation Control Component
interface RotationControlProps {
  onRotateAll: (direction: 'left' | 'right') => void;
  onResetAll: () => void;
}

const RotationControl = ({ onRotateAll, onResetAll }: RotationControlProps) => {
  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-white'>Rotation</h3>
        <button onClick={onResetAll} className='cursor-pointer text-sm text-red-500 hover:underline'>
          Reset all
        </button>
      </div>

      <div className='space-y-3'>
        {/* Right Rotation Button */}
        <button
          onClick={() => onRotateAll('right')}
          className='hover:text-brand-primary flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-white px-4 py-3 text-white transition-colors duration-300 hover:bg-white'
        >
          <RotateCw size={20} />
          <span className='font-medium'>RIGHT</span>
        </button>

        {/* Left Rotation Button */}
        <button
          onClick={() => onRotateAll('left')}
          className='hover:text-brand-primary flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-white px-4 py-3 text-white transition-colors duration-300 hover:bg-white'
        >
          <RotateCcw size={20} />
          <span className='font-medium'>LEFT</span>
        </button>
      </div>
    </div>
  );
};

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

  // Handle rotation for all PDFs
  const handleRotateAll = (direction: 'left' | 'right') => {
    uploadedFiles.forEach((file) => {
      const currentRotation = file.rotation || 0;
      let newRotation;

      if (direction === 'right') {
        newRotation = (currentRotation + 90) % 360;
      } else {
        newRotation = (currentRotation - 90 + 360) % 360;
      }

      updateFileData(file.id, {
        rotation: newRotation,
      });
    });
  };

  // Handle reset all rotations
  const handleResetAll = () => {
    uploadedFiles.forEach((file) => {
      updateFileData(file.id, {
        rotation: 0,
      });
    });
  };

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
          <div className='space-y-4'>
            {/* Info Text */}
            <div className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
              <p className='mb-3'>
                Mouse over PDF file below and a <RotateCw className='mx-1 inline h-4 w-4' /> icon will appear, click on
                the arrows to rotate PDFs.
              </p>
            </div>

            {/* Rotation Controls */}
            <RotationControl onRotateAll={handleRotateAll} onResetAll={handleResetAll} />
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
