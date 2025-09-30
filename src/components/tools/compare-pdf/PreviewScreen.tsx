'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';

import ActionSidebar from '@/components/tool/ActionSidebar';
import AddFileOptions from '@/components/tool/AddFileOptions';
import EmptyPdfPlaceholder from '@/components/tool/EmptyPdfPlaceholder';
import SidebarToggleButton from '@/components/tool/SidebarToggleButton';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { useCustomPdfToolStore, type UploadedFile } from '@/store/useCustomPdfToolStore';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Download content type options
const DOWNLOAD_CONTENT_TYPES = [
  { value: 'common', label: 'Common Content', description: 'Show common content between both PDFs' },
  { value: 'only_in_pdf1', label: 'Only in PDF 1', description: 'Content only present in first PDF' },
  { value: 'only_in_pdf2', label: 'Only in PDF 2', description: 'Content only present in second PDF' },
  { value: 'diff_pdf', label: 'Difference PDF', description: 'Generate PDF showing differences' },
  { value: 'diff_json', label: 'Difference JSON', description: 'Generate JSON with differences' },
];

interface ComparePdfScreenProps {
  heading: string;
  buttonLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
}

// Static PDF Item Component (same as your original)
interface PdfItemProps {
  file: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
}

const PdfItem = ({ file, index, onRemove }: PdfItemProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div
      className={`group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] items-center justify-center rounded-md px-[43px] py-[39px] hover:border`}
    >
      {/* Remove Button */}
      <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-0 transition-opacity group-hover:opacity-100'>
        <button
          className='bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110'
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          aria-label='Remove file'
        >
          <X size={12} className='text-white' />
        </button>
      </div>

      {/* File Number Badge */}
      <div className='bg-brand-primary absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'>
        {index + 1}
      </div>

      {/* PDF Thumbnail */}
      <div className='transition-all'>
        <div className='relative flex items-center justify-center overflow-hidden'>
          <Document
            file={file.previewFileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className='flex items-center justify-center'
          >
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
      {numPages && numPages > 1 && (
        <div className='absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-xs text-white'>
          {numPages} pages
        </div>
      )}
    </div>
  );
};

// Dropdown Component for download content type
interface DropdownProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const DownloadTypeDropdown = ({ selectedValue, onValueChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = DOWNLOAD_CONTENT_TYPES.find((option) => option.value === selectedValue);

  return (
    <div className='w-full'>
      <h3 className='mt-8 mb-4 text-lg font-semibold text-white'>Download Content Type</h3>

      <div className='relative'>
        <button
          className='flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300'
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex-1 text-left'>
            <div className='font-medium text-gray-900'>{selectedOption?.label}</div>
            <div className='mt-1 text-sm text-gray-500'>{selectedOption?.description}</div>
          </div>
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className='absolute top-full right-0 left-0 z-10 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg'>
            {DOWNLOAD_CONTENT_TYPES.map((option) => (
              <div
                key={option.value}
                role='button'
                tabIndex={0}
                className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                  selectedValue === option.value ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent scroll when space is pressed
                    onValueChange(option.value);
                    setIsOpen(false);
                  }
                }}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div
                      className={`font-medium ${selectedValue === option.value ? 'text-blue-600' : 'text-gray-900'}`}
                    >
                      {option.label}
                    </div>
                    <div className='mt-1 text-sm text-gray-500'>{option.description}</div>
                  </div>
                  {selectedValue === option.value && (
                    <div className='ml-3 flex-shrink-0'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
                        <Check size={16} className='text-white' />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ComparePdfScreen = ({
  heading,
  buttonLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
}: ComparePdfScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const setProcessedFileName = useCustomPdfToolStore((state) => state.setProcessedFileName);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDownloadType, setSelectedDownloadType] = useState<string>('common');

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

  // Handle comparison process
  const handleCompare = async () => {
    if (uploadedFiles.length !== 2) {
      toast.error('Please upload exactly 2 PDF files for comparison');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Comparing PDFs...');

    try {
      // Create FormData
      const formData = new FormData();

      // Add both files to FormData
      uploadedFiles.forEach((fileItem) => {
        formData.append('file', fileItem.file);
      });

      // Add download content type
      formData.append('download_content_type', selectedDownloadType);

      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}compare-pdf`, {
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

        // Navigate to download screen
        setScreenType('download');
        toast.success('PDF comparison completed successfully!');
      } else {
        throw new Error(result.message || 'Failed to compare PDFs');
      }
    } catch (error) {
      console.error('Comparison error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to compare PDFs. Please try again.');
    } finally {
      toast.dismiss(toastId);
      setIsProcessing(false);
    }
  };

  const btnDisabledCondition = uploadedFiles.length !== 2 || isProcessing;

  return (
    <div className='flex h-full'>
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

      {/* Left Side - PDF Preview */}
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
          <div className='flex flex-wrap justify-center gap-[11.37px]'>
            {uploadedFiles.map((file, index) => (
              <PdfItem key={file.id} file={file} index={index} onRemove={removeUploadedFile} />
            ))}
          </div>

          {uploadedFiles.length === 0 && <EmptyPdfPlaceholder />}
        </div>

        {/* Add File Section */}
        <div className='absolute top-[100px] right-[37.7px] flex flex-col items-center gap-3'>
          <AddFileOptions fileCount={uploadedFiles.length} onUpload={open} />
        </div>
      </div>

      {/* Right Side - Action Sidebar */}
      <ActionSidebar
        heading={heading}
        buttonLabel={buttonLabel}
        isProcessing={isProcessing}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onProcess={handleCompare}
        canProcess={!btnDisabledCondition}
        fileCount={uploadedFiles.length}
      >
        <div className='space-y-4'>
          {/* Info Text */}
          <p className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
            Compare two PDF files to find differences, similarities, or unique content. Upload exactly 2 PDF files and
            choose your preferred comparison output format.
          </p>

          {/* Download Type Dropdown */}
          <DownloadTypeDropdown selectedValue={selectedDownloadType} onValueChange={setSelectedDownloadType} />
        </div>
      </ActionSidebar>
    </div>
  );
};

export default ComparePdfScreen;
