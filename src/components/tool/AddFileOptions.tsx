'use client';

import { type JSX, useState } from 'react';
import { Plus, Upload } from 'lucide-react';

interface AddFileOptionsProps {
  fileCount: number;
  onUpload: () => void;
}

const AddFileOptions = ({ fileCount, onUpload }: AddFileOptionsProps): JSX.Element => {
  const [showOptions, setShowOptions] = useState(false);

  const handleHover = (state: boolean) => {
    setShowOptions(state);
  };

  const iconButtonClasses = (color: string) =>
    `flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-300 hover:${color}-600 ${
      !showOptions ? 'mt-[-60px]' : 'mt-0'
    }`;

  const commonBtn = `transition-transform duration-200 hover:scale-105`;

  return (
    <div
      className='relative flex flex-col items-center gap-3'
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* File Count Badge */}
      <div className='bg-brand-primary shadow-custom-badge-md absolute top-[-15px] left-[-15px] z-20 flex h-[34.5px] w-[34.5px] items-center justify-center rounded-full text-center text-lg text-white lg:text-[24.15px]'>
        {fileCount}
      </div>

      {/* Main Add Button */}
      <button
        type='button'
        className={`bg-brand-primary hover:bg-brand-primary-dark relative z-10 flex h-[55px] w-[55px] items-center justify-center rounded-full text-white lg:h-[66.5px] lg:w-[66.5px] ${commonBtn}`}
        onClick={() => handleHover(!showOptions)}
      >
        <Plus className='h-6 w-6 transition-transform duration-300' />
      </button>

      {/* Upload From Computer */}
      <button
        type='button'
        onClick={onUpload}
        className={`bg-gray-500 hover:bg-gray-600 ${iconButtonClasses('bg-gray-500')}`}
        title='Upload from computer'
      >
        <Upload />
      </button>

      {/* Add from URL */}
      {/* <button
        type='button'
        onClick={() => toast.info('URL import coming soon!')}
        className={`bg-green-500 ${iconButtonClasses('bg-green-500')}`}
        title='Add from URL'
      >
        <Link />
      </button> */}

      {/* Add from Google Drive */}
      {/* <button
        type='button'
        onClick={() => toast.info('Google Drive import coming soon!')}
        className={`bg-purple-500 ${iconButtonClasses('bg-purple-500')}`}
        title='Add from Google Drive'
      >
        <HardDrive />
      </button> */}

      {/* Add from Dropbox */}
      {/* <button
        type='button'
        onClick={() => toast.info('Dropbox import coming soon!')}
        className={`bg-blue-500 ${iconButtonClasses('bg-blue-500')}`}
        title='Add from Dropbox'
      >
        <PackageOpen />
      </button> */}
    </div>
  );
};

export default AddFileOptions;
