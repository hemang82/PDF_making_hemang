import type { JSX } from 'react';
import MyContainer from '@/components/common/MyContainer';
import Image from 'next/image';
import Link from 'next/link';

const DiscoverNow = (): JSX.Element => {
  return (
    <section className='bg-brand-primary'>
      <MyContainer className='flex max-md:flex-col max-md:items-center max-md:text-center'>
        {/* Left Side */}
        <Image
          src='/images/home/discover-now-pdf-conversion-illustration.png'
          alt='PDF Conversion Illustration'
          width={585}
          height={384}
          className='mt-[-55px] ml-[-50px] object-contain max-md:mt-4 max-md:ml-0 max-md:w-[80%]'
        />

        {/* Right Side */}
        <div className='ml-auto flex w-[547px] flex-col pt-[53px] pb-[32.61px] text-center capitalize max-md:ml-0 max-md:w-full max-md:items-center max-md:pt-6 max-md:pb-6 md:text-start xl:text-end'>
          <h2 className='pr-4 text-[45px]/[54px] font-normal text-white max-md:px-4 max-md:text-[28px]/[36px]'>
            Our <strong>PDF editor</strong> blends simplicity with power
          </h2>

          <div className='mt-[40px] flex items-center gap-[40px] pb-[21.5px] pl-3.5 max-md:mt-6 max-md:flex-col max-md:gap-4 max-md:pl-0'>
            <Image
              src='/images/home/discover-now-decorative-white-arrow-design.svg'
              alt=''
              width={158.7}
              height={51.5}
              className='hidden h-auto w-auto max-md:order-2 lg:block'
              aria-hidden='true'
            />

            <Link
              href='#'
              className='shadow-custom-3d-md inline-block rounded-full border border-black bg-white px-[38.5px] py-[18px] leading-[18px] font-semibold max-md:px-6 max-md:py-3 max-md:text-sm'
            >
              Discover Now
            </Link>
          </div>
        </div>
      </MyContainer>
    </section>
  );
};
export default DiscoverNow;
