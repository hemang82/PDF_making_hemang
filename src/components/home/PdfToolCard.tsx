import Image from 'next/image';
import type { JSX } from 'react';

interface PdfToolCardProps {
  iconPath: string;
  title: string;
  description: string;
  href: string;
}

const PdfToolCard = ({ iconPath, title, description, href }: PdfToolCardProps): JSX.Element => {
  return (
    <a
      href={href}
      className='hover:bg-brand-primary shadow-custom-md border-brand-slate-200 group h-[159px] rounded-[20px] border bg-white p-4 pr-5 transition-colors'
    >
      <div className='mb-[9px] flex items-center gap-[13]'>
        <div className='bg-brand-primary flex h-[55px] w-[55px] items-center justify-center rounded-full transition-colors group-hover:bg-white'>
          <div className='relative h-[30px] w-[30px]'>
            <Image
              src={iconPath}
              alt={`${title} Icon`}
              fill
              className='object-contain transition-colors group-hover:[filter:brightness(10%)_saturate(100%)_invert(71%)_sepia(33%)_saturate(629%)_hue-rotate(146deg)_brightness(94%)_contrast(89%)]'
            />
          </div>
        </div>
        <h3 className='text-lg font-semibold transition-colors group-hover:text-white'>{title}</h3>
      </div>

      <p className='text-brand-gray-600 text-sm/[21px] font-normal transition-colors group-hover:text-white'>
        {description}
      </p>
    </a>
  );
};

export default PdfToolCard;
