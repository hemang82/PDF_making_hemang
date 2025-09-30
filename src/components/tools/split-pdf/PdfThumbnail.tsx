'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { type JSX } from 'react';
import { AlertCircle } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfThumbnailProps {
  file: File;
}

const PdfThumbnail = ({ file }: PdfThumbnailProps): JSX.Element => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
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
    setHasError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setHasError(true);
  };

  if (!fileUrl) {
    return (
      <div className='flex items-center justify-center bg-gray-100'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className='flex flex-col items-center justify-center border-2 border-red-200 bg-red-50 p-2'>
        <AlertCircle className='mb-1 h-6 w-6 text-red-400' />
        <span className='text-center text-xs text-red-600'>Error loading PDF</span>
      </div>
    );
  }

  return (
    <>
      {Array.from(new Array(numPages), (_, index) => (
        <div key={`page_${index + 1}`} className='relative'>
          <div className='group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] items-center rounded-md px-[43px] py-[39px] hover:border'>
            <div className='relative flex items-center justify-center overflow-hidden'>
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=''
                error=''
                className='flex items-center justify-center'
              >
                <Page
                  pageNumber={index + 1}
                  width={80.5}
                  height={113.86}
                  loading=''
                  error=''
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className='shadow-sm'
                />
              </Document>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PdfThumbnail;
