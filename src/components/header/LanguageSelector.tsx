import Image from 'next/image';
import { useState, type JSX } from 'react';

const LanguageSelector = (): JSX.Element => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        className='flex items-center gap-1.5 text-[13px]/[19.5px] font-bold'
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        aria-label='Select language'
      >
        <Image src='/images/header/globe-icon.svg' alt='Language Selector Globe Icon' width={24} height={24} />
        English
        <Image
          src='/images/header/white-chevron-down-icon.svg'
          alt='White Chevron Down Icon'
          width={9.8}
          height={12}
          className={`transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isLanguageDropdownOpen && (
        <div className='shadow-custom-md animate-in fade-in slide-in-from-top-2 absolute top-full left-0 mt-1 w-32 scale-95 rounded-md bg-white duration-200'>
          <button className='text-brand-gray-600 hover:bg-brand-primary-100 border-brand-slate-200 block w-full rounded-t-md border-b px-4 py-2 text-left text-sm transition-colors duration-200'>
            English
          </button>
          <button className='text-brand-gray-600 hover:bg-brand-primary-100 border-brand-slate-200 block w-full border-b px-4 py-2 text-left text-sm transition-colors duration-200'>
            Español
          </button>
          <button className='text-brand-gray-600 hover:bg-brand-primary-100 block w-full rounded-b-md px-4 py-2 text-left text-sm transition-colors duration-200'>
            Français
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
