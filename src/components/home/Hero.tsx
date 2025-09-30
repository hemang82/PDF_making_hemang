import Image from 'next/image';
import type { JSX } from 'react';
import MyContainer from '@/components/common/MyContainer';

const Hero = (): JSX.Element => {
  return (
    <section className='bg-brand-primary-100 relative overflow-hidden'>
      <Image
        className='absolute top-0 left-0 max-md:h-auto max-md:w-[180px]'
        src='/images/home/hero-bg-decorative-loop-line-design.svg'
        alt=''
        width={257}
        height={231}
        aria-hidden='true'
      />
      <MyContainer className='flex flex-col items-center lg:flex-row'>
        {/* Left Side */}
        <div className='w-[72%] space-y-10 max-lg:mt-10 max-md:w-full max-md:px-4 max-md:text-center'>
          <h1 className='relative text-[40px] text-black max-md:text-[28px] max-md:leading-[36px]'>
            Every tool you need to
            <div className='relative inline-block'>
              <span
                className='bg-contain bg-center bg-no-repeat px-6 py-2 font-bold text-white'
                style={{ backgroundImage: "url('/images/home/hero-text-bg-design.svg')" }}
              >
                Work
              </span>
              <Image
                className='absolute top-[-32px] right-[-45px] max-md:hidden'
                src='/images/home/hero-decorative-black-dotted-design.png'
                alt=''
                width={61}
                height={68}
                aria-hidden='true'
              />
            </div>
            with <strong>PDFs in one place</strong>
          </h1>

          <p className='font-inter text-brand-gray-600 pr-[200px] text-[18px]/[28.8px] font-normal max-md:pr-0 max-md:text-[16px] max-md:leading-[26px]'>
            All-in-one free PDF tools: merge, split, compress, convert, rotate, unlock, and watermark with ease!
          </p>

          {/* Search Tools */}
          <div className='flex max-w-[436px] items-center justify-between rounded-full border border-black max-md:mx-auto max-md:w-full max-md:max-w-[90%]'>
            <input
              type='search'
              placeholder='Search Tools...'
              className='text-brand-slate-950 w-[380px] rounded-full p-4 text-sm outline-none placeholder:font-normal placeholder:text-black max-md:w-full max-md:px-4'
              aria-label='Search PDF tools'
            />
            <div className='bg-brand-primary m-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white'>
              <Image src='/images/home/hero-search-icon.svg' alt='Search Icon' width={20} height={20} />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className='relative pt-5 pr-[50px] pl-[75px] max-md:mt-10 max-md:px-4 max-md:pr-0 max-md:pl-0'>
          {/* Hero Image */}
          <Image
            priority
            className='relative z-10 max-md:h-auto max-md:w-full'
            src='/images/home/hero-main-image.png'
            alt='Smiling woman holding PDF document illustration'
            width={570}
            height={400}
          />

          {/* Hide vectors on small screen */}
          <Image
            className='absolute top-[35.5px] left-[83px] z-10 max-md:hidden'
            src='/images/home/hero-decorative-pdf-edit-icon.svg'
            alt=''
            width={73.5}
            height={73.5}
            aria-hidden='true'
          />
          <Image
            className='absolute top-[171.5px] left-[43.5px] z-10 max-md:hidden'
            src='/images/home/hero-decorative-arrow-loop-design.svg'
            alt=''
            width={70.5}
            height={49.5}
            aria-hidden='true'
          />
          <Image
            className='absolute bottom-[135.5px] left-[4.5px] max-md:hidden'
            src='/images/home/hero-decorative-pdf-camera-icon.svg'
            alt=''
            width={73.5}
            height={73.5}
            aria-hidden='true'
          />
          <Image
            className='absolute bottom-[21.5px] left-0 max-md:hidden'
            src='/images/home/hero-decorative-star-burst-design.svg'
            alt=''
            width={52}
            height={49.5}
            aria-hidden='true'
          />
          <Image
            priority
            className='absolute top-[7px] left-[84px] max-md:hidden'
            src='/images/home/hero-decorative-white-dotted-design.png'
            alt='Decorative white dotted design'
            width={351}
            height={351}
          />
          <Image
            priority
            className='absolute bottom-0 left-[82px] max-md:hidden'
            src='/images/home/hero-decorative-white-star-design.png'
            alt='Decorative white star design'
            width={136}
            height={139}
          />
          <Image
            className='absolute top-[58px] right-[50px] max-md:hidden'
            src='/images/home/hero-decorative-resize-icon.svg'
            alt=''
            width={81.96}
            height={81.96}
            aria-hidden='true'
          />
          <Image
            className='absolute top-[200px] right-0 max-md:hidden'
            src='/images/home/hero-decorative-zigzag-line-design.svg'
            alt=''
            width={91.94}
            height={17.26}
            aria-hidden='true'
          />
          <Image
            className='absolute right-0 bottom-[41px] max-md:hidden'
            src='/images/home/hero-decorative-heart-shape-icon.svg'
            alt=''
            width={30}
            height={24}
            aria-hidden='true'
          />
        </div>
      </MyContainer>
    </section>
  );
};

export default Hero;
