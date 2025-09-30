import { type JSX } from 'react';

interface ProcessingOverlayProps {
  isVisible: boolean;
  message: string;
  title?: string;
}

const ProcessingOverlay = ({
  isVisible,
  message,
  title = 'Processing...',
}: ProcessingOverlayProps): JSX.Element | null => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='mx-4 w-xl rounded-lg bg-white p-8 shadow-2xl'>
        <div className='flex flex-col items-center space-y-4'>
          {/* Animated Loading Spinner */}
          <div className='relative'>
            <div className='border-brand-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='bg-brand-primary h-2 w-2 animate-pulse rounded-full'></div>
            </div>
          </div>

          {/* Processing Message */}
          <div className='text-center'>
            <h3 className='mb-2 text-lg font-semibold text-gray-800'>{title}</h3>
            <p className='text-gray-600'>{message}</p>
          </div>

          {/* Progress Dots */}
          {/* <div className='flex space-x-2'>
            <div className='bg-brand-primary h-2 w-2 animate-bounce rounded-full'></div>
            <div
              className='bg-brand-primary h-2 w-2 animate-bounce rounded-full'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='bg-brand-primary h-2 w-2 animate-bounce rounded-full'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div> */}

          {/* Note */}
          <p className='text-center text-xs text-gray-500'>Please wait while we process your files...</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
