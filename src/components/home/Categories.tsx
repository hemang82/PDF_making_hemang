import type { JSX } from 'react';
import MyContainer from '@/components/common/MyContainer';
import PdfToolCard from '@/components/home/PdfToolCard';
import Image from 'next/image';
import { PDF_TOOLS } from '@/constants/pdfTools';

const Categories = (): JSX.Element => {
  return (
    <section id='pdf-tools' className='relative scroll-mt-28 pt-[50px] pb-[157px]'>
      {/* Decorative Designs */}
      <Image
        priority
        className='absolute right-0 bottom-0'
        src='/images/common/page-bg-decorative-dotted-design.svg'
        alt=''
        width={177}
        height={188}
        aria-hidden='true'
      />
      <Image
        priority
        className='absolute right-[108px] bottom-[100px] z-[-1] lg:bottom-[188px]'
        src='/images/home/categories-bg-decorative-three-stars-design.svg'
        alt=''
        width={88}
        height={84}
        aria-hidden='true'
      />

      <MyContainer>
        {/* Heading */}
        <div className='mb-[30px] px-4 text-center md:mb-[40px]'>
          <h2 className='mb-2 text-2xl font-semibold md:text-4xl/[48px]'>Your Complete PDF Solution Hub</h2>
          <p className='text-brand-slate-600 font-inter text-sm sm:text-base md:px-[30px] md:text-lg lg:px-[60px] xl:px-[140px]'>
            Create, convert, and customize PDFs in seconds. Our powerful yet simple tools help you generate professional
            documents, merge files, compress large PDFs, and edit content seamlessly.
          </p>
        </div>

        {/* <div className='mx-auto w-[440px] text-center max-md:w-full max-md:px-4'>
          <span className='bg-brand-primary font-inter rounded-full px-[50px] py-1 text-base font-medium text-white max-md:px-6 max-md:text-sm'>
            Categories
          </span>
          <h2 className='mt-3.5 mb-[40px] text-4xl/[48px] font-semibold max-md:mb-8 max-md:text-[24px]/[32px]'>
            One-Stop Shop For All Your PDF Needs
          </h2>
        </div> */}

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {PDF_TOOLS.map((tool) => (
            <PdfToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </MyContainer>
    </section>
  );
};
export default Categories;
