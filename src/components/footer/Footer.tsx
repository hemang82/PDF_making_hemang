/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  const pdfEditLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Tools', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  const productLinks = [
    { name: 'PdfEdit desktop', href: '#' },
    { name: 'PdfEdit mobile', href: '#' },
    { name: 'Developers', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Events', href: '#' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      image: '/images/footer/facebook.svg',
      href: 'https://facebook.com/pdfmaking',
      width: 8,
      height: 20,
    },
    {
      name: 'Twitter',
      image: '/images/footer/twitter.svg',
      href: 'https://twitter.com/pdfmaking',
      width: 16,
      height: 20,
    },
    { name: 'WhatsApp', image: '/images/footer/whatsapp.svg', href: 'https://wa.me/pdfmaking', width: 15, height: 20 },
    {
      name: 'Instagram',
      image: '/images/footer/instagram.svg',
      href: 'https://instagram.com/pdfmaking',
      width: 15,
      height: 20,
    },
    {
      name: 'YouTube',
      image: '/images/footer/youtube.svg',
      href: 'https://youtube.com/pdfmaking',
      width: 21,
      height: 20,
    },
  ];

  return (
    <footer className='bg-brand-slate-800 relative text-white'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0 z-0 h-full w-full'>
        {/* Background Image */}
        <Image
          className='h-full w-full object-cover opacity-10'
          src='/images/footer/footer-bg.png'
          alt='Footer background'
          fill
        />
      </div>

      {/* Content */}
      <div className='max-w-container relative z-10 mx-auto px-9 xl:px-0'>
        <div className='grid grid-cols-1 justify-items-center gap-8 py-8 sm:grid-cols-2 sm:justify-items-start md:grid-cols-3 lg:grid-cols-4'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <a href='/' aria-label='PDF Making home'>
              <Image
                priority
                src='/pdfmaking-white-logo.svg'
                alt='PDFMaking logo'
                width={210}
                height={45}
                className='h-auto w-auto'
              />
            </a>
            <p className='mt-4 text-center text-sm leading-relaxed text-gray-300 sm:text-left md:text-left md:text-[16px]'>
              Your all in one tool <br /> to edit PDF files.
            </p>
          </div>

          {/* Other sections remain the same */}
          {/* PDFEdit Links */}
          <div className='space-y-4'>
            <h3 className='text-center text-lg font-semibold sm:text-left md:text-left'>
              PDFedit
              <div className='bg-brand-primary mx-auto mt-1 h-0.5 w-8 sm:mx-0'></div>
            </h3>
            <ul className='space-y-3 text-center sm:text-left md:text-left'>
              {pdfEditLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className='hover:text-brand-primary text-sm text-gray-300 transition-colors'>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div className='space-y-4'>
            <h3 className='text-center text-lg font-semibold sm:text-left md:text-left'>
              Product
              <div className='bg-brand-primary mx-auto mt-1 h-0.5 w-8 sm:mx-0'></div>
            </h3>
            <ul className='space-y-3 text-center sm:text-left md:text-left'>
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className='hover:text-brand-primary text-sm text-gray-300 transition-colors'>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Share with Us */}
          <div className='space-y-4'>
            <h3 className='text-center text-lg font-semibold sm:text-left md:text-left'>
              Share with Us
              <div className='bg-brand-primary mx-auto mt-1 h-0.5 w-8 sm:mx-0'></div>
            </h3>
            <p className='text-center text-sm text-gray-300 sm:text-left'>Special offers on social network</p>
            <div className='flex justify-center gap-4 sm:justify-start'>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`Follow us on ${social.name}`}
                >
                  <Image src={social.image} alt={social.name} width={social.width} height={social.height} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='bg-brand-slate-700 relative z-10'>
        <div className='max-w-container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 lg:flex-row'>
          <p className='text-sm text-gray-300'>© {new Date().getFullYear()} pdfmaking.com. All rights reserved.</p>
          <div className='flex items-center gap-6'>
            <a href='#' className='hover:text-brand-primary text-sm text-gray-300 transition-colors'>
              Term of Use
            </a>
            <span className='text-gray-500'>|</span>
            <a href='#' className='hover:text-brand-primary text-sm text-gray-300 transition-colors'>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
