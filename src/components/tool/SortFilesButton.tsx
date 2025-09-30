'use client';

import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';
import { ArrowDownAZ, ArrowDownZA } from 'lucide-react';
import { type JSX } from 'react';
import { toast } from 'sonner';

interface SortFilesButtonProps {
  fileCount: number;
}

const SortFilesButton = ({ fileCount }: SortFilesButtonProps): JSX.Element => {
  const sortOrder = useCustomPdfToolStore((state) => state.sortOrder);
  const sortFilesByName = useCustomPdfToolStore((state) => state.sortFilesByName);

  return (
    <button
      className='border-brand-primary hover:border-brand-primary-dark flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border transition-transform duration-300 hover:scale-105'
      onClick={() => {
        if (fileCount === 0) {
          toast.error('Please upload at least one PDF file to proceed.');
          return;
        }
        sortFilesByName();
      }}
      aria-label={`Sort files ${sortOrder === 'asc' ? 'Z to A' : 'A to Z'}`}
      title={`Sort files ${sortOrder === 'asc' ? 'Z to A' : 'A to Z'}`}
    >
      {sortOrder === 'asc' ? (
        <ArrowDownZA size={30} className='text-brand-primary' />
      ) : (
        <ArrowDownAZ size={30} className='text-brand-primary' />
      )}
    </button>
  );
};

export default SortFilesButton;
