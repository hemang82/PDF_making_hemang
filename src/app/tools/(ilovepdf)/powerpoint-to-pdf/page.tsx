import type { Metadata } from 'next';
import { type JSX } from 'react';
import PptToPdfClient from '@/app/tools/(ilovepdf)/powerpoint-to-pdf/PptToPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert PowerPoint to PDF - Free PPT to PDF Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert PowerPoint presentations (PPT/PPTX) to PDF online instantly, maintaining formatting - free and secure with no signup required.',
  keywords: [
    'PowerPoint to PDF',
    'PPT to PDF',
    'PPTX to PDF',
    'convert PowerPoint to PDF',
    'presentation converter',
    'free PDF tools',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}powerpoint-to-pdf`,
  },
  openGraph: {
    title: `Convert PowerPoint to PDF - Free & Secure Presentation Converter | ${process.env.SITE_NAME}`,
    description:
      'Transform PowerPoint presentations into PDFs while preserving layout and formatting. Fast and free conversion.',
    url: `${process.env.SITE_URL_TOOLS}powerpoint-to-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert PowerPoint to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert PowerPoint to PDF - Free & Secure Presentation Converter | ${process.env.SITE_NAME}`,
    description: 'Convert PowerPoint presentations to PDF instantly while maintaining formatting - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      PowerPoint to PDF Page Component
---------------------------------------------------------------*/
export default function PptToPdfPage(): JSX.Element {
  return <PptToPdfClient />;
}
