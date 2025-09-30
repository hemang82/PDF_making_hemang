import type { Metadata } from 'next';
import { type JSX } from 'react';
import PdfToJpgClient from '@/app/tools/(ilovepdf)/pdf-to-jpg/PdfToJpgClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert PDF to JPG - Free PDF to Image Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert PDF files to high-quality JPG images online instantly - free and secure with no signup required.',
  keywords: [
    'PDF to JPG',
    'PDF to image',
    'convert PDF to JPG',
    'PDF converter',
    'free PDF tools',
    'PDF to image online',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}pdf-to-jpg`,
  },
  openGraph: {
    title: `Convert PDF to JPG - Free & Secure PDF to Image Converter | ${process.env.SITE_NAME}`,
    description: 'Transform PDF files into high-quality JPG images. Fast and free conversion with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}pdf-to-jpg`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert PDF to JPG Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert PDF to JPG - Free & Secure PDF to Image Converter | ${process.env.SITE_NAME}`,
    description: 'Convert PDF files to JPG images instantly with high quality - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      PDF to JPG Page Component
---------------------------------------------------------------*/
export default function PdfToJpgPage(): JSX.Element {
  return <PdfToJpgClient />;
}
