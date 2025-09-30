import MyContainer from '@/components/common/MyContainer';
import Image from 'next/image';
import type { JSX } from 'react';

// Trust logos data
const trustLogos = [
  {
    id: 1,
    src: '/images/home/getpremium-pdf-association.png',
    alt: 'PDF Association',
  },
  {
    id: 2,
    src: '/images/home/getpremium-iso.png',
    alt: 'ISO 27001',
  },
  {
    id: 3,
    src: '/images/home/getpremium-secure.png',
    alt: 'SSL Secure Encryption',
  },
];

const GetPremium = (): JSX.Element => {
  return (
    <section className='relative min-h-screen'>
      {/* Background with 2/3 split */}
      <div className='absolute inset-0'>
        {/* Top 2/3 - Turquoise background */}
        <div className='bg-brand-primary h-2/3'></div>
        {/* Bottom 1/3 - Light background */}
        <div className='h-1/3 bg-gray-50'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 pt-20 pb-16'>
        <MyContainer>
          {/* Header Section */}
          <div className='mb-16 text-center text-white'>
            {/* Journey Badge */}
            <span className='font-inter rounded-full bg-white px-[50px] py-1 text-base font-medium text-black'>
              Journey
            </span>

            {/* Main Title */}
            <h1 className='my-3 text-xl font-[600] md:text-2xl lg:text-4xl/[48px]'>
              The PDF Software Trusted By Millions Of Users
            </h1>

            {/* Subtitle */}
            <p className='mx-auto max-w-[755px] text-lg font-[400] md:text-[16px]/[28px]'>
              PDFedit is your number one web app for editing PDF with ease. Enjoy all the tools you need to work
              efficiently with your digital documents while keeping your data safe and secure.
            </p>
          </div>

          {/* Trust Logos */}
          <div className='mb-20 flex max-w-5xl flex-wrap items-center justify-center gap-10 sm:flex-row sm:justify-between lg:mx-auto'>
            {/* <div className='mx-auto mb-20 flex max-w-5xl flex-wrap items-center justify-between'> */}
            {trustLogos.map((logo) => (
              <div
                key={logo.id}
                className='relative flex h-[75px] w-[150px] items-center justify-center lg:h-[100px] lg:w-[200px]'
              >
                <Image src={logo.src} alt={logo.alt} fill />
              </div>
            ))}
          </div>

          {/* Premium CTA Card */}
          <div className='mx-auto max-w-7xl'>
            <div
              style={{ boxShadow: '0px 0px 24px 0px #0000001A' }}
              className='relative overflow-hidden rounded-2xl border border-[#BDBDBD] bg-white p-8 md:p-12'
            >
              <div className='relative z-10 grid items-center gap-8 md:grid-cols-2'>
                {/* Content Side */}
                <div>
                  <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl/[48px]'>Get More With Premium</h2>
                  <p className='text-brand-slate-600 mb-8 text-lg/[28px] font-[400]'>
                    Complete projects faster with batch file processing, convert scanned document with OCR and e-sign
                    your business agreements.
                  </p>

                  <button className='bg-brand-primary hover:bg-brand-primary-dark flex transform cursor-pointer items-center gap-2 rounded-full px-8 py-4 font-semibold text-white shadow-[4px_4px_0_1px_rgba(0,0,0,1)] transition-all duration-300'>
                    Get Premium
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                  </button>
                </div>

                {/* Illustration Side */}
                <div className='relative flex justify-center'>
                  <div className='absolute -top-[20px] -right-[20px]'>
                    <Image
                      src='/images/home/getpremium-shape.png'
                      alt='Premium Illustration'
                      width={40}
                      height={48}
                      className='h-[40px] w-[48px] object-contain'
                    />
                  </div>
                  <div className='relative flex justify-between'>
                    <div className='flex items-center justify-center'>
                      <Image
                        src='/images/home/getpremium-roud-line-shape.png'
                        alt='Premium Illustration'
                        width={64}
                        height={93}
                        className='h-[64px] w-[93px] object-contain'
                      />
                    </div>
                    <div>
                      <Image
                        src='/images/home/getpremium-pdf.png'
                        alt='Premium Illustration'
                        width={283}
                        height={408}
                        className='h-[283px] w-[408px] object-contain'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MyContainer>
      </div>
    </section>
  );
};

export default GetPremium;
