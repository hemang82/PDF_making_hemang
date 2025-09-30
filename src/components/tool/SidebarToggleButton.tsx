'use client';

import { Settings, X } from 'lucide-react';
import { type JSX } from 'react';

interface SidebarToggleButtonProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const SidebarToggleButton = ({ isSidebarOpen, onToggle }: SidebarToggleButtonProps): JSX.Element => {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={`fixed top-[165px] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#51BCD0] text-white shadow-lg transition-all duration-200 hover:bg-[#45A8BC] lg:hidden ${isSidebarOpen ? 'right-[305px] md:right-[430px]' : 'right-4'}`}
      aria-label='Toggle Sidebar'
    >
      {isSidebarOpen ? <X className='h-6 w-6' /> : <Settings className='h-6 w-6' />}
    </button>
  );
};

export default SidebarToggleButton;
