import type { Metadata } from 'next';
import { type JSX } from 'react';
import CompressPdfClient from '@/app/tools/(ilovepdf)/compress-pdf/CompressPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Compress PDF Files - Free PDF Compressor | ${process.env.SITE_NAME}`,
  description:
    'Reduce PDF file size while maintaining quality - compress PDFs online instantly, securely, and for free.',
  keywords: [
    'compress PDF',
    'PDF compressor',
    'reduce PDF size',
    'compress PDF files online',
    'free PDF tools',
    'PDF optimizer',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}compress-pdf`,
  },
  openGraph: {
    title: `Compress PDF Files - Free & Secure PDF Compressor | ${process.env.SITE_NAME}`,
    description: 'Reduce PDF file size while maintaining quality. Fast online PDF compression with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}compress-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Compress PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Compress PDF Files - Free & Secure PDF Compressor | ${process.env.SITE_NAME}`,
    description:
      'Reduce PDF file size while maintaining quality. Compress PDFs instantly and securely - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Merge PDF Page Component
---------------------------------------------------------------*/
export default function CompressPdfPage(): JSX.Element {
  return <CompressPdfClient />;
}
