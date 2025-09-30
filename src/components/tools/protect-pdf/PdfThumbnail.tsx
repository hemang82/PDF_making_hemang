'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { type JSX } from 'react';
import { FileText, AlertCircle } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfThumbnailProps {
  file: File;
  className?: string;
  width?: number;
  height?: number;
}

const PdfThumbnail = ({ file, className = '', width = 80.5, height = 113.86 }: PdfThumbnailProps): JSX.Element => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    // Create object URL for the PDF file
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Cleanup function to revoke the object URL
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
    setHasError(true);
  };

  const onPageRenderSuccess = () => {
    setIsLoading(false);
  };

  const onPageRenderError = (error: Error) => {
    console.error('Error rendering PDF page:', error);
    setIsLoading(false);
    setHasError(true);
  };

  if (!fileUrl) {
    return (
      <div
        className={`${className} flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100`}
      >
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} flex flex-col items-center justify-center border-2 border-red-200 bg-red-50 p-2`}>
        <AlertCircle className='mb-1 h-6 w-6 text-red-400' />
        <span className='text-center text-xs text-red-600'>Error loading PDF</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative flex items-center justify-center overflow-hidden`}>
      {isLoading && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-gray-50'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-[#51BCD0] border-t-transparent' />
        </div>
      )}

      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading=''
        error=''
        className='flex items-center justify-center'
      >
        <Page
          pageNumber={1}
          width={width}
          height={height}
          onRenderSuccess={onPageRenderSuccess}
          onRenderError={onPageRenderError}
          loading=''
          error=''
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className='shadow-sm'
        />
      </Document>

      {/* Fallback icon if PDF doesn't render */}
      {!isLoading && !hasError && !numPages && (
        <div className='flex flex-col items-center justify-center text-gray-400'>
          <FileText className='mb-1 h-8 w-8' />
          <span className='text-xs'>PDF</span>
        </div>
      )}
    </div>
  );
};

export default PdfThumbnail;
