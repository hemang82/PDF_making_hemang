'use client';

import { X } from 'lucide-react';
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

// Types
interface RemovePagesPreviewScreenProps {
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

// PDF Page Component
interface PdfPageProps {
  file: UploadedFile;
  pageNumber: number;
  isMarkedForRemoval?: boolean;
  onToggle?: (pageNumber: number) => void;
  showCheckbox?: boolean;
}

const PdfPage = ({ file, pageNumber, isMarkedForRemoval = false, onToggle, showCheckbox = false }: PdfPageProps) => {
  const handleClick = () => showCheckbox && onToggle?.(pageNumber);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showCheckbox && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onToggle?.(pageNumber);
    }
  };

  return (
    <div className='relative'>
      <div
        className={`group relative flex h-[191.28px] w-[166.63px] items-center rounded-md px-[43px] py-[39px] transition-all duration-100 ${
          isMarkedForRemoval
            ? 'bg-red-50 outline-2 outline-red-500'
            : 'bg-brand-slate-50 hover:outline-brand-primary outline-transparent hover:outline'
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={showCheckbox ? 0 : -1}
        role={showCheckbox ? 'button' : undefined}
        aria-pressed={showCheckbox ? isMarkedForRemoval : undefined}
      >
        {/* Page Number Badge */}
        <div className='bg-brand-primary absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'>
          {pageNumber}
        </div>

        {/* Removal Overlay */}
        {isMarkedForRemoval && (
          <div className='absolute inset-0 z-10 flex items-center justify-center rounded-md bg-red-400/20'>
            <div className='rounded-full bg-red-400 p-2'>
              <X className='h-6 w-6 text-white' />
            </div>
          </div>
        )}

        {/* PDF Thumbnail */}
        <div className='relative flex items-center justify-center overflow-hidden'>
          <Document file={file.previewFileUrl} className='flex items-center justify-center'>
            <Page
              pageNumber={pageNumber}
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

// Remove Pages Mode Component
interface RemovePagesModeProps {
  numPages: number;
  pagesToRemove: number[];
  pageInput: string;
  onPageInputChange: (value: string) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
}

const RemovePagesMode = ({
  numPages,
  pagesToRemove,
  pageInput,
  onPageInputChange,
  onClearAll,
  onSelectAll,
}: RemovePagesModeProps) => {
  const remainingPages = numPages - pagesToRemove.length;
  const isAllSelected = pagesToRemove.length === numPages;
  const isNoneSelected = pagesToRemove.length === 0;

  return (
    <div className='space-y-7'>
      <div className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
        <p className='mb-4'>Click on pages to remove from document.</p>

        <p className='mb-2 font-medium'>
          Total pages: <strong>{numPages}</strong>
        </p>

        <label htmlFor='pageInput' className='mb-2 block text-sm font-medium'>
          Pages to remove
        </label>
        <input
          id='pageInput'
          type='text'
          placeholder='example: 1,3,5-8'
          value={pageInput}
          onChange={(e) => onPageInputChange(e.target.value)}
          className='focus:ring-brand-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none'
        />
      </div>

      <div className='flex gap-2'>
        <button
          onClick={onSelectAll}
          disabled={isAllSelected}
          className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
            isAllSelected
              ? 'cursor-not-allowed border bg-gray-300 text-gray-600'
              : 'border border-white text-white hover:bg-white hover:text-[#00B5D7]'
          }`}
        >
          Select All
        </button>
        <button
          onClick={onClearAll}
          disabled={isNoneSelected}
          className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
            isNoneSelected
              ? 'cursor-not-allowed border bg-gray-300 text-gray-600'
              : 'border border-white text-white hover:bg-white hover:text-[#00B5D7]'
          }`}
        >
          Clear All
        </button>
      </div>

      {/* Status Display */}
      <div className='rounded-lg bg-white p-4 text-center text-sm shadow-md'>
        {isAllSelected ? (
          <div className='text-red-600'>
            <strong>Warning:</strong> All pages selected for removal. This will result in an empty PDF.
          </div>
        ) : pagesToRemove.length > 0 ? (
          <div className='text-gray-700'>
            <strong>
              {pagesToRemove.length} page{pagesToRemove.length === 1 ? '' : 's'}
            </strong>{' '}
            will be removed.{' '}
            <strong>
              {remainingPages} page{remainingPages === 1 ? '' : 's'}
            </strong>{' '}
            will remain.
          </div>
        ) : (
          <div className='text-gray-700'>No pages selected for removal. Original PDF will be unchanged.</div>
        )}
      </div>
    </div>
  );
};

// Custom Hook for Remove Pages Logic
const useRemovePagesLogic = (numPages: number) => {
  const [pagesToRemove, setPagesToRemove] = useState<number[]>([]);
  const [pageInput, setPageInput] = useState('');

  // Reset function to clear all state
  const resetRemovePagesState = () => {
    setPagesToRemove([]);
    setPageInput('');
  };

  const handlePageToggle = (pageNumber: number) => {
    const newPagesToRemove = pagesToRemove.includes(pageNumber)
      ? pagesToRemove.filter((p) => p !== pageNumber)
      : [...pagesToRemove, pageNumber];
    setPagesToRemove(newPagesToRemove);
    updatePageInput(newPagesToRemove);
  };

  const updatePageInput = (pages: number[]) => {
    if (pages.length === 0) {
      setPageInput('');
      return;
    }
    const sortedPages = [...pages].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sortedPages[0];
    let end = sortedPages[0];

    for (let i = 1; i < sortedPages.length; i++) {
      if (sortedPages[i] === end + 1) {
        end = sortedPages[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sortedPages[i];
        end = sortedPages[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    setPageInput(ranges.join(','));
  };

  const handlePageInputChange = (value: string) => {
    const filteredValue = value.replace(/[^0-9,-]/g, '');
    setPageInput(filteredValue);

    setPageInput(filteredValue);
    if (value.trim()) {
      const pages = parsePageInput(value);
      setPagesToRemove(pages);
    } else {
      setPagesToRemove([]);
    }
  };

  const parsePageInput = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= numPages && !pages.includes(i)) {
              pages.push(i);
            }
          }
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= numPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }
    return pages.sort((a, b) => a - b);
  };

  const handleClearAll = () => {
    setPagesToRemove([]);
    setPageInput('');
  };

  const handleSelectAll = () => {
    const allPages = Array.from({ length: numPages }, (_, i) => i + 1);
    setPagesToRemove(allPages);
    updatePageInput(allPages);
  };

  const canProcess = numPages && pagesToRemove.length > 0 && pagesToRemove.length < numPages;

  return {
    pagesToRemove,
    pageInput,
    canProcess,
    resetRemovePagesState,
    handlePageToggle,
    handlePageInputChange,
    handleClearAll,
    handleSelectAll,
  };
};

// Main Component
const RemovePagesPreviewScreen = ({
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
}: RemovePagesPreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const updateFileData = useCustomPdfToolStore((state) => state.updateFileData);
  const clearAllFiles = useCustomPdfToolStore((state) => state.clearAllFiles);
  const setILovePdfDownloadInfo = useCustomPdfToolStore((state) => state.setILovePdfDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [numPages, setNumPages] = useState<number>(0);

  const currentFile = uploadedFiles[0];

  const {
    pagesToRemove,
    pageInput,
    canProcess,
    resetRemovePagesState,
    handlePageToggle,
    handlePageInputChange,
    handleClearAll,
    handleSelectAll,
  } = useRemovePagesLogic(numPages);

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

  const onDocumentLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
    setNumPages(pages);
  };

  // Responsive sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRemoveFile = () => {
    // Clear all uploaded files
    clearAllFiles();

    // Reset all remove pages-related state using the hook's reset function
    resetRemovePagesState();

    // Reset numPages in component state
    setNumPages(0);

    // Close sidebar on mobile if open
    setIsSidebarOpen(false);
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
          console.error(`[${toolName} Page Upload Error]:`, errorData?.error);
          toast.error(`Failed to upload file. Please refresh and try again.`);
          throw new Error('Upload failed');
        }

        const data = await response.json();

        // Update state
        updateFileData(fileItem.id, {
          server_filename: data.server_filename,
        });
      });

      // Wait for all uploads
      await Promise.all(uploadPromises);
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Upload files error:`, message);
      toast.error(`Failed to upload files. Please refresh and try again.`);
      throw error;
    }
  };

  const processTask = async (task: string, server: string) => {
    const currentFiles = useCustomPdfToolStore.getState().uploadedFiles;

    // Map UI state to iLovePDF API parameters for remove pages
    const apiParams: any = {
      split_mode: 'remove_pages',
      remove_pages: pagesToRemove.join(','),
    };

    const filePayload = currentFiles.map((f) => ({
      server_filename: f.server_filename,
      filename: `pdfmaking_${fileNameAddOn}_${f.name}`,
      rotate: f.rotation || 0,
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
          ...apiParams,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} Process error:`, errorData?.error);
        toast.error(`Failed to process ${toolName} task. Please refresh and try again.`);
        throw new Error('Process failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Process error:`, message);
      toast.error(`Failed to process files. Please refresh and try again.`);
      throw error;
    }
  };

  // Handle process
  const handleProcess = async () => {
    if (pagesToRemove.length === numPages) {
      toast.error('Cannot remove all pages. At least one page must remain.');
      return;
    }

    if (pagesToRemove.length === 0) {
      toast.error('Please select at least one page to remove.');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Initialize the task
      setProcessingMessage('Initializing task...');
      const taskData = await initializeTask();

      if (!taskData?.task || !taskData.server) {
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
        toast.success('Pages removed successfully!');
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

  const renderPagesContent = () => {
    if (!currentFile || !numPages) return null;

    return (
      <div className='flex flex-col items-center justify-center gap-[11.37px] md:flex-row md:flex-wrap'>
        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
          <PdfPage
            key={pageNumber}
            file={currentFile}
            pageNumber={pageNumber}
            isMarkedForRemoval={pagesToRemove.includes(pageNumber)}
            onToggle={handlePageToggle}
            showCheckbox={true}
          />
        ))}
      </div>
    );
  };

  const btnDisabledCondition = uploadedFiles.length === 0 || isProcessing || !canProcess;

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
            {currentFile && (
              <div className='mb-4 flex flex-col items-center justify-between lg:flex-row'>
                <h3 className='text-lg font-semibold'>{currentFile.name}</h3>
                <button
                  onClick={handleRemoveFile}
                  className='cursor-pointer text-red-500 underline transition-transform hover:scale-105 hover:text-red-600'
                >
                  Remove File
                </button>
              </div>
            )}

            {currentFile && (
              <Document file={currentFile.previewFileUrl} onLoadSuccess={onDocumentLoadSuccess} className='hidden'>
                <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            )}

            {renderPagesContent()}

            {!currentFile && <EmptyPdfPlaceholder />}
          </div>

          {/* Add File Section */}
          {!currentFile && (
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
          <div className='w-full'>
            {currentFile && numPages > 0 && (
              <RemovePagesMode
                numPages={numPages}
                pagesToRemove={pagesToRemove}
                pageInput={pageInput}
                onPageInputChange={handlePageInputChange}
                onClearAll={handleClearAll}
                onSelectAll={handleSelectAll}
              />
            )}

            {!currentFile && (
              <div className='text-center text-white'>
                <p className='text-sm'>Upload a PDF file to start removing pages</p>
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

export default RemovePagesPreviewScreen;
