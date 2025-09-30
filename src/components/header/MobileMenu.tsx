/* eslint-disable @next/next/no-html-link-for-pages */
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Add this import
import { type JSX } from 'react';

const organizeTools = [
  { name: 'Merge PDF', href: '/tools/merge-pdf', icon: '📄', color: 'bg-red-100 text-red-600' },
  { name: 'Split PDF', href: '/tools/split-pdf', icon: '✂️', color: 'bg-red-100 text-red-600' },
  { name: 'Remove pages', href: '/tools/remove-pages', icon: '❌', color: 'bg-red-100 text-red-600' },
  // { name: 'Organize PDF', href: '/tools/organize-pdf', icon: '📊', color: 'bg-red-100 text-red-600' },
  // { name: 'Scan to PDF', href: '/tools/scan-to-pdf', icon: '📷', color: 'bg-red-100 text-red-600' },
];

const editTools = [
  { name: 'Rotate PDF', href: '/tools/rotate-pdf', icon: '🔄', color: 'bg-purple-100 text-purple-600' },
  { name: 'Add page numbers', href: '/tools/add-page-numbers', icon: '🔢', color: 'bg-purple-100 text-purple-600' },
  // { name: 'Add watermark', href: '/tools/watermark-pdf', icon: '💧', color: 'bg-purple-100 text-purple-600' },
  // { name: 'Crop PDF', href: '/tools/crop-pdf', icon: '✂️', color: 'bg-purple-100 text-purple-600' },
  { name: 'Edit PDF', href: '/tools/edit-pdf', icon: '✏️', color: 'bg-purple-100 text-purple-600' },
];

const securityTools = [
  { name: 'Unlock PDF', href: '/tools/unlock-pdf', icon: '🔓', color: 'bg-blue-100 text-blue-600' },
  { name: 'Protect PDF', href: '/tools/protect-pdf', icon: '🔒', color: 'bg-blue-100 text-blue-600' },
  { name: 'Sign PDF', href: '/tools/sign-pdf', icon: '✍️', color: 'bg-blue-100 text-blue-600' },
  { name: 'Redact PDF', href: '/tools/redact-pdf', icon: '⬛', color: 'bg-blue-100 text-blue-600' },
  { name: 'Compare PDF', href: '/tools/compare-pdf', icon: '🔍', color: 'bg-blue-100 text-blue-600' },
];

interface MobileMenuProps {
  onClose: () => void;
  isMobileMenuOpen: boolean;
  isUserLogin: boolean;
  handleLogoutClick: () => void;
}

const MobileMenu = ({ onClose, isMobileMenuOpen, isUserLogin, handleLogoutClick }: MobileMenuProps): JSX.Element => {
  const pathname = usePathname(); // Get current pathname

  return (
    <div
      className={`fixed inset-0 z-[55] transition-all duration-300 lg:hidden ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      {/* Background Overlay */}
      {/* <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={onClose}
        /> */}

      {/* Menu Content */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-sm transform bg-white transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Menu Header */}
        <div className='shadow-custom-sm flex items-center justify-between px-6 py-6'>
          {/* <div className='flex items-center gap-3'> */}
          <a href='/' aria-label='PDF Making home'>
            <Image
              priority
              src='/pdfmaking-logo.svg'
              alt='PDFMaking logo'
              width={210}
              height={45}
              className='h-auto w-auto'
            />
          </a>
          {/* </div> */}

          <button onClick={onClose} className='p-2'>
            <Image src='/images/header/close-x-icon.svg' alt='Close X Icon' width={40} height={40} />
          </button>
        </div>

        {/* Scrollable Menu Content */}
        <div className='h-full overflow-y-auto px-6 py-6 pb-[120px] shadow-sm'>
          {/* Quick Tools */}
          <div className='mb-8'>
            <h4 className='text-brand-slate-800 mb-4 text-sm font-semibold'>Quick Tools</h4>
            <div className='space-y-3'>
              <a
                href='/tools/merge-pdf'
                className={`group flex transform items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:scale-105 ${
                  pathname === '/tools/merge-pdf'
                    ? 'bg-brand-primary-50 text-brand-primary scale-105 shadow-sm'
                    : 'hover:bg-brand-primary-50 hover:text-brand-primary bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-lg text-red-600 transition-transform duration-200 ${
                    pathname === '/tools/merge-pdf' ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  📄
                </div>
                <span
                  className={`font-medium ${
                    pathname === '/tools/merge-pdf'
                      ? 'text-brand-primary'
                      : 'text-brand-slate-700 group-hover:text-brand-primary'
                  }`}
                >
                  Merge PDF
                </span>
              </a>
              <a
                href='/tools/split-pdf'
                className={`group flex transform items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:scale-105 ${
                  pathname === '/tools/split-pdf'
                    ? 'bg-brand-primary-50 text-brand-primary scale-105 shadow-sm'
                    : 'hover:bg-brand-primary-50 hover:text-brand-primary bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-lg text-red-600 transition-transform duration-200 ${
                    pathname === '/tools/split-pdf' ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  ✂️
                </div>
                <span
                  className={`font-medium ${
                    pathname === '/tools/split-pdf'
                      ? 'text-brand-primary'
                      : 'text-brand-slate-700 group-hover:text-brand-primary'
                  }`}
                >
                  Split PDF
                </span>
              </a>
              <a
                href='/tools/compress-pdf'
                className={`group flex transform items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:scale-105 ${
                  pathname === '/tools/compress-pdf'
                    ? 'bg-brand-primary-50 text-brand-primary scale-105 shadow-sm'
                    : 'hover:bg-brand-primary-50 hover:text-brand-primary bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg text-green-600 transition-transform duration-200 ${
                    pathname === '/tools/compress-pdf' ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  🗜️
                </div>
                <span
                  className={`font-medium ${
                    pathname === '/tools/compress-pdf'
                      ? 'text-brand-primary'
                      : 'text-brand-slate-700 group-hover:text-brand-primary'
                  }`}
                >
                  Compress PDF
                </span>
              </a>
            </div>
          </div>

          {/* Popular Conversions */}
          <div className='mb-8'>
            <h4 className='text-brand-slate-800 mb-4 text-sm font-semibold'>Popular Conversions</h4>
            <div className='space-y-3'>
              <a
                href='/tools/pdf-to-word'
                className={`group flex transform items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:scale-105 ${
                  pathname === '/tools/pdf-to-word'
                    ? 'bg-brand-primary-50 text-brand-primary scale-105 shadow-sm'
                    : 'hover:bg-brand-primary-50 hover:text-brand-primary bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 transition-transform duration-200 ${
                    pathname === '/tools/pdf-to-word' ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  📄
                </div>
                <span
                  className={`font-medium ${
                    pathname === '/tools/pdf-to-word'
                      ? 'text-brand-primary'
                      : 'text-brand-slate-700 group-hover:text-brand-primary'
                  }`}
                >
                  PDF to WORD
                </span>
              </a>
              <a
                href='/tools/word-to-pdf'
                className={`group flex transform items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:scale-105 ${
                  pathname === '/tools/word-to-pdf'
                    ? 'bg-brand-primary-50 text-brand-primary scale-105 shadow-sm'
                    : 'hover:bg-brand-primary-50 hover:text-brand-primary bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 transition-transform duration-200 ${
                    pathname === '/tools/word-to-pdf' ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  📄
                </div>
                <span
                  className={`font-medium ${
                    pathname === '/tools/word-to-pdf'
                      ? 'text-brand-primary'
                      : 'text-brand-slate-700 group-hover:text-brand-primary'
                  }`}
                >
                  WORD to PDF
                </span>
              </a>
              <a
                href='/tools/pdf-to-jpg'
                className={`group flex transform items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:scale-105 ${
                  pathname === '/tools/pdf-to-jpg'
                    ? 'bg-brand-primary-50 text-brand-primary scale-105 shadow-sm'
                    : 'hover:bg-brand-primary-50 hover:text-brand-primary bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-lg text-yellow-600 transition-transform duration-200 ${
                    pathname === '/tools/pdf-to-jpg' ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  🖼️
                </div>
                <span
                  className={`font-medium ${
                    pathname === '/tools/pdf-to-jpg'
                      ? 'text-brand-primary'
                      : 'text-brand-slate-700 group-hover:text-brand-primary'
                  }`}
                >
                  PDF to JPG
                </span>
              </a>
              <a
                href='/tools/jpg-to-pdf'
                className={`group flex transform items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:scale-105 ${
                  pathname === '/tools/jpg-to-pdf'
                    ? 'bg-brand-primary-50 text-brand-primary scale-105 shadow-sm'
                    : 'hover:bg-brand-primary-50 hover:text-brand-primary bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-lg text-yellow-600 transition-transform duration-200 ${
                    pathname === '/tools/jpg-to-pdf' ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  🖼️
                </div>
                <span
                  className={`font-medium ${
                    pathname === '/tools/jpg-to-pdf'
                      ? 'text-brand-primary'
                      : 'text-brand-slate-700 group-hover:text-brand-primary'
                  }`}
                >
                  JPG to PDF
                </span>
              </a>
            </div>
          </div>

          {/* All Tools Categories */}
          <div className='mb-8'>
            <h4 className='text-brand-slate-800 mb-4 text-sm font-semibold'>Organize PDF</h4>
            <div className='space-y-2'>
              {organizeTools.map((tool) => {
                const isActive = pathname === tool.href;
                return (
                  <a
                    key={tool.href}
                    href={tool.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-primary-50 text-brand-primary shadow-sm'
                        : 'text-brand-slate-700 hover:bg-brand-primary-50 hover:text-brand-primary'
                    }`}
                    onClick={onClose}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg ${tool.color} flex items-center justify-center text-sm transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`}
                    >
                      {tool.icon}
                    </div>
                    <span className='font-medium'>{tool.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className='mb-8'>
            <h4 className='text-brand-slate-800 mb-4 text-sm font-semibold'>Edit & Security</h4>
            <div className='space-y-2'>
              {[...editTools, ...securityTools].slice(0, 6).map((tool) => {
                const isActive = pathname === tool.href;
                return (
                  <a
                    key={tool.href}
                    href={tool.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-primary-50 text-brand-primary shadow-sm'
                        : 'text-brand-slate-700 hover:bg-brand-primary-50 hover:text-brand-primary'
                    }`}
                    onClick={onClose}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg ${tool.color} flex items-center justify-center text-sm transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`}
                    >
                      {tool.icon}
                    </div>
                    <span className='font-medium'>{tool.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* View All Tools */}
          <div className='mb-8'>
            <a
              href='/#pdf-tools'
              className='bg-brand-primary hover:bg-brand-primary-dark flex transform items-center justify-center gap-3 rounded-xl px-6 py-4 font-medium text-white transition-all duration-200 hover:scale-105'
              onClick={onClose}
            >
              <span>View All Tools</span>
              <ChevronDown size={18} className='rotate-[-90deg]' />
            </a>
          </div>

          {/* Auth Buttons */}
          <div className='space-y-4 border-t border-gray-200 pt-6'>
            {!isUserLogin ? (
              <>
                <a
                  href='/auth/login'
                  className='text-brand-slate-700 flex transform items-center justify-center gap-3 rounded-xl bg-gray-100 px-6 py-4 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-200'
                  onClick={onClose}
                >
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  Log In
                </a>
                <a
                  href='/auth/signup'
                  className='bg-brand-primary hover:bg-brand-primary-dark flex transform items-center justify-center gap-3 rounded-xl px-6 py-4 font-medium text-white transition-all duration-200 hover:scale-105'
                  onClick={onClose}
                >
                  Sign up
                </a>
              </>
            ) : (
              <button
                className='text-brand-slate-700 mb-10 flex w-full transform items-center justify-center gap-3 rounded-xl bg-gray-100 px-6 py-4 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-200'
                onClick={() => handleLogoutClick()}
              >
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
