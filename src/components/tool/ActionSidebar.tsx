'use client';

import Image from 'next/image';
import { type JSX } from 'react';

interface ActionSidebarProps {
  heading: string;
  buttonLabel: string;
  onProcess: () => void;
  isProcessing: boolean;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
  canProcess: boolean;
  fileCount: number;
  children?: React.ReactNode;
}

const ActionSidebar = ({
  heading,
  buttonLabel,
  onProcess,
  isProcessing,
  isSidebarOpen,
  onCloseSidebar,
  canProcess,
  fileCount,
  children,
}: ActionSidebarProps): JSX.Element => {
  return (
    <>
      {/* Sidebar Content */}
      <div
        className={`bg-brand-primary fixed right-0 z-20 flex h-[calc(100vh-145px)] w-[300px] transform flex-col justify-between overflow-auto p-6 transition-transform duration-300 md:w-[420px] lg:relative lg:translate-x-0 lg:p-[30px] ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className='flex flex-col items-center'>
          <h1 className='mb-2 text-center text-3xl font-semibold text-white lg:mb-[20px] lg:text-[36px]/[48px]'>
            {heading}
          </h1>

          {/* Custom content */}
          {children ?? <p className='text-sm text-white'>This tool helps you process files easily.</p>}
        </div>

        {/* Bottom Section - Sticky Button with White Background and Blur Effect */}
        <div className='sticky bottom-0'>
          {/* White background with blur fade effect at top */}
          <div className='bg-brand-primary relative -mx-6 -mb-6 px-6 pt-6 pb-6 lg:-mx-[30px] lg:-mb-[30px] lg:px-[30px] lg:pt-1'>
            {/* Blur fade gradient at the top */}
            <div className='via-brand-primary-100/25 from-brand-primary/0 to-brand-primary-100/75 pointer-events-none absolute top-0 right-0 left-0 h-7 bg-gradient-to-b' />

            {/* Button */}
            <button
              type='button'
              onClick={onProcess}
              aria-label={buttonLabel}
              disabled={!canProcess}
              className='shadow-custom-3d-md hover:bg-brand-white-dark relative z-10 mt-[25px] flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-black bg-white px-[30px] py-[15px] text-base font-bold transition-colors duration-200 ease-in-out lg:mt-[50px] lg:px-[60px] lg:py-[25px] lg:text-[20px]/[17.92px]'
            >
              {isProcessing ? (
                <>
                  <div className='border-brand-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent' />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{buttonLabel}</span>
                  <Image
                    src='/images/pdf-tools/black-right-arrow-icon.svg'
                    alt='Black Right Arrow Icon'
                    width={15}
                    height={15}
                    className='h-auto w-auto'
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop (Desktop) */}
      {fileCount === 0 && (
        <div className='bg-opacity-50 fixed right-0 z-30 hidden h-[calc(100vh-145px)] w-[300px] backdrop-blur-xs md:w-[420px] lg:block' />
      )}

      {/* Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div
          className='bg-opacity-50 fixed inset-0 z-10 backdrop-blur-xs lg:hidden'
          role='button'
          tabIndex={0}
          aria-label='Close sidebar'
          onClick={onCloseSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onCloseSidebar();
            }
          }}
        />
      )}

      {/* Sidebar Mobile Process Button */}
      <button
        type='button'
        onClick={onProcess}
        aria-label={buttonLabel}
        disabled={!canProcess}
        className='shadow-custom-3d-md hover:bg-brand-white-dark fixed right-[16px] bottom-[16px] z-10 flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-black bg-white px-[30px] py-[15px] text-base font-bold transition-colors duration-200 ease-in-out lg:hidden lg:px-[60px] lg:py-[25px] lg:text-[20px]/[17.92px]'
      >
        {isProcessing ? (
          <>
            <div className='border-brand-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent' />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{buttonLabel}</span>
            <Image
              src='/images/pdf-tools/black-right-arrow-icon.svg'
              alt='Black Right Arrow Icon'
              width={15}
              height={15}
              className='h-auto w-auto'
            />
          </>
        )}
      </button>
    </>
  );
};

export default ActionSidebar;
