import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';

interface NavLinkProps {
  title: string;
  href?: string;
  isMegaMenu?: boolean;
}

const NavLink = ({ title, href, isMegaMenu }: NavLinkProps): JSX.Element => {
  const pathname = usePathname();
  const isActive = href && pathname === href;

  return href ? (
    <a
      href={href}
      className={`group relative text-sm font-medium transition-colors duration-200 xl:text-base ${
        isActive ? 'text-brand-primary' : 'hover:text-brand-primary'
      }`}
    >
      {title}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
          isActive ? 'bg-brand-primary w-full' : 'bg-brand-primary w-0 group-hover:w-full'
        }`}
      ></span>
    </a>
  ) : (
    <span className='text-sm xl:text-base'>
      {title}
      {isMegaMenu && (
        <Image
          src='/images/header/black-chevron-down-icon.svg'
          alt='Black Chevron Down Icon'
          width={14}
          height={14}
          className='ml-1.5 inline-block'
        />
      )}
    </span>
  );
};

export default NavLink;
