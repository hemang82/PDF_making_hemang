'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { type UploadedFile } from '@/store/useCustomPdfToolStore';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SortablePdfItemProps {
  file: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  isDragging?: boolean;
}

const SortablePdfItem = ({ file, index, onRemove, onRotate, isDragging = false }: SortablePdfItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: file.id });

  const rotation = file.rotation || 0;
  const [numPages, setNumPages] = useState<number | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] cursor-move items-center justify-center rounded-md px-[43px] py-[39px] hover:border ${
        isSortableDragging ? 'border-brand-primary-dark border-2 border-dotted' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Remove & Rotate Buttons */}
      <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-0 transition-opacity group-hover:opacity-100'>
        <button
          className='bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] items-center justify-center rounded-full transition-all duration-200 hover:scale-110'
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

        <button
          className='bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] items-center justify-center rounded-full transition-all duration-200 hover:scale-110'
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
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </button>
      </div>

      {/* File Index Badge */}
      <div className='bg-brand-primary absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'>
        {index + 1}
      </div>

      {/* PDF Thumbnail */}
      <div className='transition-all' style={{ transform: `rotate(${rotation}deg)` }}>
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
    </div>
  );
};

export default SortablePdfItem;
