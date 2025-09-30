'use client';

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

interface PreviewScreenProps {
  heading: string;
  buttonLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
}

// PDF Page Item Component (without drag functionality)
interface PdfPageItemProps {
  file: UploadedFile;
  pageNumber: number;
  totalPages: number;
  onRemove: (id: string) => void;
  pagePosition: string;
  formatChoice: string;
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

const PdfPageItem = ({
  file,
  pageNumber,
  totalPages,
  onRemove,
  pagePosition,
  formatChoice,
  fontFamily,
  fontSize,
  fontColor,
  bold,
  italic,
  underline,
}: PdfPageItemProps) => {
  // Generate page number text based on format choice
  const getPageNumberText = () => {
    switch (formatChoice) {
      case 'number_only':
        return pageNumber.toString();
      case 'page_n':
        return `Page ${pageNumber}`;
      case 'page_n_of_p':
        return `Page ${pageNumber} of ${totalPages}`;
      default:
        return pageNumber.toString();
    }
  };

  // Get position styles for page number overlay
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
      color: fontColor,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      textDecoration: underline ? 'underline' : 'none',
      zIndex: 10,
    };

    switch (pagePosition) {
      case 'top left':
        return { ...baseStyles, top: '8px', left: '8px' };
      case 'top center':
        return { ...baseStyles, top: '8px', left: '50%', transform: 'translateX(-50%)' };
      case 'top right':
        return { ...baseStyles, top: '8px', right: '8px' };
      case 'bottom left':
        return { ...baseStyles, bottom: '8px', left: '8px' };
      case 'bottom center':
        return { ...baseStyles, bottom: '8px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom right':
        return { ...baseStyles, bottom: '8px', right: '8px' };
      default:
        return { ...baseStyles, bottom: '8px', right: '8px' };
    }
  };

  return (
    <div className='group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] items-center justify-center rounded-md px-[43px] py-[39px] hover:border'>
      {/* PDF Page with Number Overlay */}
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

        {/* Page Number Overlay */}
        <div style={getPositionStyles()}>{getPageNumberText()}</div>
      </div>
    </div>
  );
};

const AddPageNumbersPreviewScreen = ({
  heading,
  buttonLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
}: PreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const setProcessedFileName = useCustomPdfToolStore((state) => state.setProcessedFileName);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [allPages, setAllPages] = useState<Array<{ file: UploadedFile; pageNumber: number; totalPages: number }>>([]);

  // Page numbering options
  const [pagePosition, setPagePosition] = useState('bottom right');
  const [formatChoice, setFormatChoice] = useState('number_only');
  const [margin, setMargin] = useState('recommended');
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [fontSize, setFontSize] = useState('12');
  const [fontColor, setFontColor] = useState('black');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

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

  // Generate all pages when files or selected file changes
  useEffect(() => {
    const generateAllPages = async () => {
      if (uploadedFiles.length === 0) {
        setAllPages([]);
        return;
      }

      const pages: Array<{ file: UploadedFile; pageNumber: number; totalPages: number }> = [];

      for (const file of uploadedFiles) {
        try {
          // Load PDF to get page count
          const pdf = await pdfjs.getDocument(file.previewFileUrl).promise;
          const numPages = pdf.numPages;

          // If a specific file is selected, only show its pages
          if (selectedFileId && selectedFileId !== file.id) {
            continue;
          }

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            pages.push({
              file,
              pageNumber: pageNum,
              totalPages: numPages,
            });
          }
        } catch (error) {
          console.error('Error loading PDF:', error);
        }
      }

      setAllPages(pages);
    };

    generateAllPages();
  }, [uploadedFiles, selectedFileId]);

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

  // Handle process
  const handleProcess = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one PDF file');
      return;
    }

    setIsProcessing(true);
    setProcessingMessage('Processing your files...');

    try {
      // Create FormData
      const formData = new FormData();

      // Add the selected file or first file
      const fileToProcess = selectedFileId ? uploadedFiles.find((f) => f.id === selectedFileId) : uploadedFiles[0];

      if (!fileToProcess) {
        throw new Error('No file selected for processing');
      }

      formData.append('file', fileToProcess.file);
      formData.append('position', pagePosition);
      formData.append('format_choice', formatChoice);
      formData.append('margin', margin);
      formData.append('font_family', fontFamily);
      formData.append('font_size', fontSize);
      formData.append('font_color', fontColor);
      formData.append('bold', bold.toString());
      formData.append('italic', italic.toString());
      formData.append('underline', underline.toString());

      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}add-page-number`, {
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
        toast.success('Page numbers added successfully!');
      } else {
        throw new Error(result.message || 'Failed to add page numbers');
      }
    } catch (error) {
      console.error('Process error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add page numbers. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const btnDisabledCondition = uploadedFiles.length === 0 || isProcessing;

  const handleFontSize = (e: any) => {
    const value = e.target.value;
    setFontSize(value);
  };

  const handleFontSizeBlur = () => {
    if (fontSize === '') {
      setFontSize('12');
    } else {
      let numValue = parseInt(fontSize);
      if (isNaN(numValue) || numValue < 1) numValue = 1;
      else if (numValue > 48) numValue = 48;
      setFontSize(numValue.toString());
    }
  };

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

          {/* File Selection Dropdown */}
          {uploadedFiles.length > 1 && (
            <div className='fixed top-[148px] left-[37.7px] z-10 lg:absolute lg:top-[5px]'>
              <select
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
                className='focus:border-brand-primary focus:ring-brand-primary rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              >
                <option value=''>Show all files</option>
                {uploadedFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pages Grid */}
          <div className='mb-[50px] h-fit w-full lg:mx-[75px]'>
            <div className='flex flex-col items-center justify-center gap-[11.37px] md:flex-row md:flex-wrap'>
              {allPages.map((page, index) => (
                <PdfPageItem
                  key={`${page.file.id}-${page.pageNumber}`}
                  file={page.file}
                  pageNumber={page.pageNumber}
                  totalPages={page.totalPages}
                  onRemove={removeUploadedFile}
                  pagePosition={pagePosition}
                  formatChoice={formatChoice}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontColor={fontColor}
                  bold={bold}
                  italic={italic}
                  underline={underline}
                />
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
          canProcess={!btnDisabledCondition}
          fileCount={uploadedFiles.length}
        >
          <div className='space-y-4'>
            <p className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
              Add page numbers to your PDF documents with customizable position, format, and styling options.
            </p>

            {/* Position Selection */}
            <div className='space-y-2'>
              <label htmlFor='position' className='text-sm font-medium text-white'>
                Position
              </label>
              <select
                id='position'
                value={pagePosition}
                onChange={(e) => setPagePosition(e.target.value)}
                className='focus:border-brand-primary focus:ring-brand-primary w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              >
                <option value='top left'>Top Left</option>
                <option value='top center'>Top Center</option>
                <option value='top right'>Top Right</option>
                <option value='bottom left'>Bottom Left</option>
                <option value='bottom center'>Bottom Center</option>
                <option value='bottom right'>Bottom Right</option>
              </select>
            </div>

            {/* Format Selection */}
            <div className='space-y-2'>
              <label htmlFor='format' className='text-sm font-medium text-white'>
                Format
              </label>
              <select
                id='format'
                value={formatChoice}
                onChange={(e) => setFormatChoice(e.target.value)}
                className='focus:border-brand-primary focus:ring-brand-primary w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              >
                <option value='number_only'>Number Only</option>
                <option value='page_n'>Page N</option>
                <option value='page_n_of_p'>Page N of P</option>
              </select>
            </div>

            {/* Margin Selection */}
            <div className='space-y-2'>
              <label htmlFor='margin' className='text-sm font-medium text-white'>
                Margin
              </label>
              <select
                id='margin'
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                className='focus:border-brand-primary focus:ring-brand-primary w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              >
                <option value='small'>Small</option>
                <option value='recommended'>Recommended</option>
                <option value='big'>Big</option>
              </select>
            </div>

            {/* Font Family Selection */}
            <div className='space-y-2'>
              <label htmlFor='fontFamily' className='text-sm font-medium text-white'>
                Font Family
              </label>
              <select
                id='fontFamily'
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className='focus:border-brand-primary focus:ring-brand-primary w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              >
                <option value='Helvetica'>Helvetica</option>
                <option value='Times'>Times</option>
                <option value='Courier'>Courier</option>
              </select>
            </div>

            {/* Font Size */}
            <div className='space-y-2'>
              <label htmlFor='fontSize' className='text-sm font-medium text-white'>
                Font Size (1px to 48px)
              </label>
              <input
                id='fontSize'
                type='number'
                min='0'
                max='48'
                value={fontSize}
                onBlur={handleFontSizeBlur}
                onChange={handleFontSize}
                className='focus:border-brand-primary focus:ring-brand-primary w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              />
            </div>

            {/* Font Color */}
            <div className='space-y-2'>
              <label htmlFor='fontColor' className='text-sm font-medium text-white'>
                Font Color
              </label>
              <select
                id='fontColor'
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className='focus:border-brand-primary focus:ring-brand-primary w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              >
                <option value='black'>Black</option>
                <option value='red'>Red</option>
                <option value='blue'>Blue</option>
                <option value='green'>Green</option>
                <option value='yellow'>Yellow</option>
              </select>
            </div>

            {/* Font Style Options */}
            <div className='mb-5 space-y-2'>
              <label htmlFor='font-style-bold' className='text-sm font-medium text-white'>
                Font Style
              </label>
              <div className='flex gap-4'>
                <label className='flex items-center' htmlFor='font-style-bold'>
                  <input
                    id='font-style-bold'
                    type='checkbox'
                    checked={bold}
                    onChange={(e) => setBold(e.target.checked)}
                    className='mr-2'
                  />
                  <span className='text-sm text-white'>Bold</span>
                </label>
                <label className='flex items-center' htmlFor='font-style-italic'>
                  <input
                    id='font-style-italic'
                    type='checkbox'
                    checked={italic}
                    onChange={(e) => setItalic(e.target.checked)}
                    className='mr-2'
                  />
                  <span className='text-sm text-white'>Italic</span>
                </label>
                <label className='flex items-center' htmlFor='font-style-underline'>
                  <input
                    id='font-style-underline'
                    type='checkbox'
                    checked={underline}
                    onChange={(e) => setUnderline(e.target.checked)}
                    className='mr-2'
                  />
                  <span className='text-sm text-white'>Underline</span>
                </label>
              </div>
            </div>

            {uploadedFiles.length === 0 && (
              <p className='mt-5 text-center text-sm text-white/80'>Upload a PDF file to add page numbers</p>
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

export default AddPageNumbersPreviewScreen;
