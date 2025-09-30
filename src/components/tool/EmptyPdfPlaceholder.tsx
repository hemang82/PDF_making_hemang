'use client';

import { FileText } from 'lucide-react';
import { type JSX } from 'react';

const EmptyPdfPlaceholder = (): JSX.Element => {
  return (
    <div className='rounded-xl border-2 border-dashed border-gray-300 p-2 py-12 text-center text-gray-500'>
      <FileText className='mx-auto mb-4 h-12 w-12 text-gray-300' />
      <p className='mb-2 text-lg font-medium'>No files uploaded yet</p>
      <p className='mb-2 text-sm'>
        Click the <span className='font-semibold text-gray-700'>+</span> button to upload your files,
      </p>
      <p className='text-sm text-gray-400'>or drag and drop files.</p>
    </div>
  );
};

export default EmptyPdfPlaceholder;
