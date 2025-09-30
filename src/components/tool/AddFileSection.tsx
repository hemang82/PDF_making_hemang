'use client';

import { type JSX } from 'react';
import AddFileOptions from '@/components/tool/AddFileOptions';
import SortFilesButton from '@/components/tool/SortFilesButton';

interface AddFileSectionProps {
  fileCount: number;
  isShowSortFilesButton: boolean;
  onUpload: () => void;
}

const AddFileSection = ({ fileCount, isShowSortFilesButton, onUpload }: AddFileSectionProps): JSX.Element => {
  return (
    <div className='fixed top-[230px] right-4 flex flex-col items-center gap-3 lg:top-[200px] lg:right-[450px]'>
      <AddFileOptions fileCount={fileCount} onUpload={onUpload} />
      {/* Sort Files Button */}
      {isShowSortFilesButton && <SortFilesButton fileCount={fileCount} />}
    </div>
  );
};

export default AddFileSection;
