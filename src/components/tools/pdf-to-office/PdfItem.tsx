import Image from 'next/image';
import { type JSX, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { type UploadedFile } from '@/store/useCustomPdfToolStore';

// PDF Item Component
interface PdfItemProps {
  file: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
}

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfItem = ({ file, index, onRemove }: PdfItemProps): JSX.Element => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className='group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] items-center justify-center rounded-md px-[43px] py-[39px] hover:border'>
      {/* Remove Button */}
      <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0'>
        {/* Remove Button */}
        <button
          className='bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full opacity-100 transition-all duration-200 group-hover:opacity-100 hover:scale-110 lg:opacity-0'
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
  );
};
