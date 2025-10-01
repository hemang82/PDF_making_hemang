/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import Image from 'next/image';
import { type JSX, useEffect, useState } from 'react';
import { X, LogOut, AlertTriangle } from 'lucide-react';

import MyContainer from '@/components/common/MyContainer';
import DesktopMenu from '@/components/header/DesktopMenu';
import MobileMenu from '@/components/header/MobileMenu';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Types for ConfirmationDialog component
interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

// Custom Confirmation Dialog Component
const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, title, message }: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onCancel}
        role='button'
        tabIndex={0}
        aria-label='Close dialog backdrop'
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onCancel();
          }
        }}
      ></div>

      {/* Dialog */}
      <div className='relative mx-4 w-full max-w-md transform rounded-lg border border-gray-200 bg-white p-6 shadow-2xl transition-all'>
        {/* Header */}
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className='cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
            aria-label='Close dialog'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Message */}
        <p className='mb-6 ml-13 text-gray-600'>{message}</p>

        {/* Buttons */}
        <div className='flex justify-end space-x-3'>
          <button
            onClick={onCancel}
            className='flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700'
          >
            <LogOut className='h-4 w-4' />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = (): JSX.Element | null => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsUserLogin(!!token);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  // Define paths where header should be hidden
  const hiddenPaths = ['/auth/signup', '/auth/login'];

  // Don't render header on those routes
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <>
      <header className='shadow-custom-sm sticky top-0 z-50 bg-white'>
        {/* Top Bar */}
        <div className='bg-brand-slate-800'>
          <MyContainer className='flex items-center justify-between py-2.5 text-white'>
            <div>
              <a href='#' className='text-[12px]/[14.82px] font-bold'>
                Term of Use
              </a>
              <span className='px-3'>|</span>
              <a href='#' className='text-[12px]/[14.82px] font-bold'>
                Privacy Policy
              </a>
            </div>

            <a href='#' className='text-[13px]/[14.82px] font-bold'>
              Contact Us
            </a>
          </MyContainer>
        </div>

        {/* Main Header */}
        <MyContainer className='flex items-center justify-between py-7'>
          {/* Logo */}
          <a href='/' aria-label='PDF Making home' className='relative h-[35px] w-[175px] xl:h-[45px] xl:w-[210px]'>
            <Image priority src='/pdfmaking-logo.svg' alt='PDFMaking logo' fill />
          </a>

          {/* Desktop Navigation Menu */}
          <DesktopMenu />

          {/* Auth Buttons & Mobile Menu */}
          <div className='flex items-center space-x-[15px]'>
            {/* Auth Buttons - Desktop */}
            {!isUserLogin ? (
              <div className='hidden items-center gap-3 lg:flex'>
                <Image src='/images/header/login-computer-icon.svg' alt='Login Computer Icon' width={30} height={30} />
                <a href='/auth/login'>Log In</a>

                <a
                  href='/auth/signup'
                  className='bg-brand-primary shadow-custom-3d-sm rounded-full border border-black px-5 py-2 text-white'
                >
                  Sign up
                </a>
              </div>
            ) : (
              <button
                type='button'
                className='hidden cursor-pointer items-center justify-center gap-2 border-none bg-transparent p-0 lg:flex lg:py-[6px]'
                onClick={handleLogoutClick}
                aria-label='Log out'
              >
                <Image src='/images/header/login-computer-icon.svg' alt='Login Computer Icon' width={30} height={30} />
                <span>Log out</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`text-brand-slate-950 hover:text-brand-primary relative z-[60] p-2 transition-all duration-200 hover:scale-110 lg:hidden ${isMobileMenuOpen ? 'hidden' : 'block'}`}
              aria-label='Toggle mobile menu'
            >
              <div className='relative h-6 w-6'>
                <span
                  className={`absolute top-0 left-0 h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-2.5 rotate-45' : ''}`}
                ></span>
                <span
                  className={`absolute top-2.5 left-0 h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
                ></span>
                <span
                  className={`absolute top-5 left-0 h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-2.5 -rotate-45' : ''}`}
                ></span>
              </div>
            </button>
          </div>
        </MyContainer>

        {/* Mobile Dropdown Menu (Visible on small screens only) */}
        {isMobileMenuOpen && (
          <MobileMenu
            onClose={() => setIsMobileMenuOpen(false)}
            isMobileMenuOpen={isMobileMenuOpen}
            isUserLogin={isUserLogin}
            handleLogoutClick={handleLogoutClick}
          />
        )}
      </header>

      {/* Custom Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutDialog}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        title='Confirm Logout'
        message='Are you sure you want to log out? You will need to sign in again to access your account.'
      />
    </>
  );
};

export default Header;
