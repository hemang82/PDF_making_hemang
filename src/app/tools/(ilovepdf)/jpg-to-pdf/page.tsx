import type { Metadata } from 'next';
import { type JSX } from 'react';
import JpgToPdfClient from '@/app/tools/(ilovepdf)/jpg-to-pdf/JpgToPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert JPG to PDF - Free Image to PDF Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert JPG images to PDF files online instantly - combine multiple images into one PDF, free and secure with no signup required.',
  keywords: [
    'JPG to PDF',
    'image to PDF',
    'convert JPG to PDF',
    'combine images to PDF',
    'free PDF tools',
    'image converter',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}jpg-to-pdf`,
  },
  openGraph: {
    title: `Convert JPG to PDF - Free & Secure Image to PDF Converter | ${process.env.SITE_NAME}`,
    description: 'Transform JPG images into PDF files. Combine multiple images into one PDF quickly and easily.',
    url: `${process.env.SITE_URL_TOOLS}jpg-to-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert JPG to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert JPG to PDF - Free & Secure Image to PDF Converter | ${process.env.SITE_NAME}`,
    description: 'Convert JPG images to PDF instantly, combine multiple images into one PDF - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      JPG to PDF Page Component
---------------------------------------------------------------*/
export default function JpgToPdfPage(): JSX.Element {
  return <JpgToPdfClient />;
}
