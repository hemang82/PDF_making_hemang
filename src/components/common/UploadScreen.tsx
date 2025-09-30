'use client';

import Image from 'next/image';
import { type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';

import MyContainer from '@/components/common/MyContainer';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';

interface CustomUploadScreenProps {
  title: string;
  description: string;
  buttonLabel: string;
  dropContainerLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
}

const CustomUploadScreen = ({
  title,
  description,
  buttonLabel,
  dropContainerLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
}: CustomUploadScreenProps): JSX.Element => {
  // Custom hook to handle file upload logic
  const { onDrop } = useFileUploadHandler({
    isCheckPdfPasswordProtected,
    filesLimit,
    maxFileSizePerTaskInBytes,
    accept,
  });

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

  return (
    <MyContainer>
      {/* Title and Description */}
      <h1 className='mb-2.5 pt-[50px] text-center text-2xl font-semibold lg:text-3xl xl:mb-[15px] xl:pt-[100px] xl:text-4xl/[48px] xl:tracking-[-0.75px]'>
        {title}
      </h1>
      <p className='font-inter text-brand-slate-600 mb-6 text-center text-xs font-normal lg:text-base xl:mb-[50px] xl:text-lg/[28.8px]'>
        {description}
      </p>

      {/* Upload Container */}
      <div
        {...getRootProps({
          className:
            'border border-brand-primary mx-auto max-w-[606px] rounded-[20px] p-5 xl:p-[50px] transition-colors duration-300' +
            (isDragActive ? ' bg-brand-primary-50 border-dashed' : ' bg-white'),
        })}
        aria-label='Upload area'
      >
        <input {...getInputProps()} aria-label='File input' />

        <div className='flex flex-col items-center'>
          {/* Upload Icon */}
          <div className='relative mb-[17px] h-[50px] w-[50px] xl:h-[60px] xl:w-[60px]'>
            <Image priority src='/images/pdf-tools/cloud-download-icon.svg' alt='Cloud Download Icon' fill />
          </div>

          {/* Select Files Button */}
          <button
            type='button'
            className='bg-brand-primary shadow-custom-3d-md hover:bg-brand-primary-dark cursor-pointer rounded-full border border-black px-[36px] py-[15px] text-base font-bold text-white transition-colors xl:px-[76px] xl:py-[25px] xl:text-[20px]/[17.92px]'
            aria-label={buttonLabel}
            onClick={open}
          >
            {buttonLabel}
          </button>

          {/* Drop Text */}
          <p className='font-inter text-brand-slate-600 mt-2.5 text-xs font-normal lg:text-sm xl:text-lg'>
            {dropContainerLabel}
          </p>

          {/* Cloud Storage Options */}
          {/* <div className='font-inter mt-8 flex flex-wrap items-center justify-center gap-[20px] font-normal xl:mt-[50px] xl:gap-[80px]'>
            <UploadSource
              icon='/images/pdf-tools/google-drive-icon.svg'
              label='Google Drive'
              onClick={() => toast.info('Google Drive import coming soon!')}
            />
            <UploadSource
              icon='/images/pdf-tools/url-icon.svg'
              label='By URL'
              onClick={() => toast.info('URL import coming soon!')}
            />
            <UploadSource
              icon='/images/pdf-tools/dropbox-icon.svg'
              label='Dropbox'
              onClick={() => toast.info('Dropbox import coming soon!')}
            />
          </div> */}
        </div>
      </div>
    </MyContainer>
  );
};

export default CustomUploadScreen;
