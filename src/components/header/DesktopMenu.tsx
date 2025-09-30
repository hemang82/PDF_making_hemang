import type { JSX } from 'react';
import NavLink from '@/components/header/NavLink';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation'; // Add this import

// Organized PDF tools with icons and categories
const organizeTools = [
  { name: 'Merge PDF', href: '/tools/merge-pdf', icon: '📄', color: 'bg-red-100 text-red-600' },
  { name: 'Split PDF', href: '/tools/split-pdf', icon: '✂️', color: 'bg-red-100 text-red-600' },
  { name: 'Remove pages', href: '/tools/remove-pages', icon: '❌', color: 'bg-red-100 text-red-600' },
  // { name: 'Organize PDF', href: '/tools/organize-pdf', icon: '📊', color: 'bg-red-100 text-red-600' },
  // { name: 'Scan to PDF', href: '/tools/scan-to-pdf', icon: '📷', color: 'bg-red-100 text-red-600' },
];

const optimizeTools = [
  { name: 'Compress PDF', href: '/tools/compress-pdf', icon: '🗜️', color: 'bg-green-100 text-green-600' },
  { name: 'Repair PDF', href: '/tools/repair-pdf', icon: '🔧', color: 'bg-green-100 text-green-600' },
  { name: 'OCR PDF', href: '/tools/ocr-pdf', icon: '👁️', color: 'bg-green-100 text-green-600' },
];

const convertToTools = [
  { name: 'JPG to PDF', href: '/tools/jpg-to-pdf', icon: '🖼️', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'WORD to PDF', href: '/tools/word-to-pdf', icon: '📄', color: 'bg-blue-100 text-blue-600' },
  { name: 'POWERPOINT to PDF', href: '/tools/powerpoint-to-pdf', icon: '📊', color: 'bg-orange-100 text-orange-600' },
  { name: 'EXCEL to PDF', href: '/tools/excel-to-pdf', icon: '📊', color: 'bg-green-100 text-green-600' },
  { name: 'HTML to PDF', href: '/tools/html-to-pdf', icon: '🌐', color: 'bg-yellow-100 text-yellow-600' },
];

const convertFromTools = [
  { name: 'PDF to JPG', href: '/tools/pdf-to-jpg', icon: '🖼️', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'PDF to WORD', href: '/tools/pdf-to-word', icon: '📄', color: 'bg-blue-100 text-blue-600' },
  { name: 'PDF to POWERPOINT', href: '/tools/pdf-to-powerpoint', icon: '📊', color: 'bg-orange-100 text-orange-600' },
  { name: 'PDF to EXCEL', href: '/tools/pdf-to-excel', icon: '📊', color: 'bg-green-100 text-green-600' },
  { name: 'PDF to PDF/A', href: '/tools/pdf-to-pdfa', icon: '📄', color: 'bg-blue-100 text-blue-600' },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToolCategory = ({ title, tools, currentPath }: { title: string; tools: any[]; currentPath: string }) => (
  <div className='mb-1 xl:mb-6'>
    <h3 className='text-brand-slate-500 mb-1 px-4 text-sm font-semibold tracking-wide uppercase xl:mb-3'>{title}</h3>
    <div className='space-y-1'>
      {tools.map((tool) => {
        const isActive = currentPath === tool.href;
        return (
          <a
            key={tool.href}
            href={tool.href}
            className={`group flex items-center gap-3 px-4 py-2 text-xs transition-all duration-200 xl:text-sm ${
              isActive
                ? 'bg-brand-primary-50 text-brand-primary font-medium'
                : 'text-brand-slate-700 hover:bg-brand-primary-50 hover:text-brand-primary'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-lg xl:h-8 xl:w-8 ${tool.color} flex items-center justify-center text-xs transition-transform duration-200 group-hover:scale-110 xl:text-sm ${
                isActive ? 'scale-110' : ''
              }`}
            >
              {tool.icon}
            </div>
            {tool.name}
          </a>
        );
      })}
    </div>
  </div>
);

const DesktopMenu = (): JSX.Element => {
  const pathname = usePathname(); // Get current pathname

  // Helper function to check if dropdown should be highlighted
  const isConvertDropdownActive = () => {
    const convertPaths = [...convertToTools.map((tool) => tool.href), ...convertFromTools.map((tool) => tool.href)];
    return convertPaths.includes(pathname);
  };

  const isAllToolsDropdownActive = () => {
    const allToolsPaths = [
      ...organizeTools.map((tool) => tool.href),
      ...optimizeTools.map((tool) => tool.href),
      ...convertToTools.map((tool) => tool.href),
      ...convertFromTools.map((tool) => tool.href),
      ...editTools.map((tool) => tool.href),
      ...securityTools.map((tool) => tool.href),
    ];
    return allToolsPaths.includes(pathname);
  };

  return (
    <nav
      className='hidden items-center space-x-7.5 font-medium lg:flex lg:space-x-3 xl:space-x-5'
      role='navigation'
      aria-label='Primary Navigation'
    >
      <NavLink title='Merge PDF' href='/tools/merge-pdf' />
      <NavLink title='Split PDF' href='/tools/split-pdf' />
      <NavLink title='Compress PDF' href='/tools/compress-pdf' />

      {/* Convert PDF Dropdown - Hover Activated */}
      <div className='group relative'>
        <button className='hover:text-brand-primary relative flex items-center gap-1 text-sm font-medium transition-colors duration-200 xl:text-base'>
          Convert PDF
          <ChevronDown size={16} className='transition-transform duration-300 group-hover:rotate-180' />
          <span className='bg-brand-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full'></span>
        </button>

        {/* Dropdown Menu */}
        <div className='shadow-custom-lg border-brand-slate-200 invisible absolute top-full left-0 mt-2 w-[480px] scale-95 transform rounded-lg border bg-white py-4 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:scale-100 group-hover:opacity-100'>
          <div className='grid grid-cols-2 gap-6 px-2'>
            <div className='translate-y-2 transform transition-transform delay-75 duration-300 group-hover:translate-y-0'>
              <ToolCategory title='CONVERT TO PDF' tools={convertToTools} currentPath={pathname} />
            </div>
            <div className='translate-y-2 transform transition-transform delay-100 duration-300 group-hover:translate-y-0'>
              <ToolCategory title='CONVERT FROM PDF' tools={convertFromTools} currentPath={pathname} />
            </div>
          </div>
        </div>
      </div>

      {/* All PDF Tools Dropdown - Hover Activated */}
      <div className='group relative'>
        <button className='hover:text-brand-primary relative flex items-center gap-1 text-sm font-medium transition-colors duration-200 xl:text-base'>
          All PDF Tools
          <ChevronDown size={16} className='transition-transform duration-300 group-hover:rotate-180' />
          <span className='bg-brand-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full'></span>
        </button>

        {/* Dropdown Menu */}
        <div className='shadow-custom-lg border-brand-slate-200 invisible absolute top-full right-0 mt-2 w-[720px] scale-95 transform rounded-lg border bg-white py-3 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:scale-100 group-hover:opacity-100 xl:py-4'>
          <div className='grid grid-cols-3 gap-4 px-2 xl:gap-6'>
            <div className='translate-y-2 transform transition-transform delay-75 duration-300 group-hover:translate-y-0'>
              <ToolCategory title='ORGANIZE PDF' tools={organizeTools} currentPath={pathname} />
              <ToolCategory title='PDF SECURITY' tools={securityTools} currentPath={pathname} />
            </div>
            <div className='translate-y-2 transform transition-transform delay-100 duration-300 group-hover:translate-y-0'>
              <ToolCategory title='CONVERT TO PDF' tools={convertToTools} currentPath={pathname} />
              <ToolCategory title='EDIT PDF' tools={editTools} currentPath={pathname} />
            </div>
            <div className='translate-y-2 transform transition-transform delay-125 duration-300 group-hover:translate-y-0'>
              <ToolCategory title='CONVERT FROM PDF' tools={convertFromTools} currentPath={pathname} />
              <ToolCategory title='OPTIMIZE PDF' tools={optimizeTools} currentPath={pathname} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopMenu;
