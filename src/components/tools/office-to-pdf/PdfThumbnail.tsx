'use client';

import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfThumbnailProps {
  file: File;
  className?: string;
}

const PdfThumbnail = ({ file, className = '' }: PdfThumbnailProps): JSX.Element => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create object URL for the PDF file
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Cleanup function to revoke the object URL
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Show loading spinner if file URL is not yet available
  if (!fileUrl) {
    return (
      <div
        className={`${className} flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100`}
      >
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
      </div>
    );
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  return (
    <div
      className={`${className} pointer-events-none relative flex items-center justify-center overflow-hidden select-none`}
    >
      {['doc', 'docx'].includes(fileExtension ?? '') ? (
        <Image src='/images/pdf-tools/word-to-pdf.svg' alt='Word file icon' width={50} height={50} />
      ) : ['xls', 'xlsx'].includes(fileExtension ?? '') ? (
        <Image src='/images/pdf-tools/excel-to-pdf.svg' alt='Excel file icon' width={50} height={50} />
      ) : ['ppt', 'pptx'].includes(fileExtension ?? '') ? (
        <Image src='/images/pdf-tools/powerpoint-to-pdf.svg' alt='PowerPoint file icon' width={50} height={50} />
      ) : (
        <Image src='/images/pdf-tools/pdf-locked-icon.svg' alt='PowerPoint file icon' width={50} height={50} />
      )}
    </div>
  );
};

export default PdfThumbnail;
