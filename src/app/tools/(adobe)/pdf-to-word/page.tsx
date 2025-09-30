import type { Metadata } from 'next';
import { type JSX } from 'react';
import PdfToWordClient from '@/app/tools/(adobe)/pdf-to-word/PdfToWordClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert PDF to Word - Free PDF to DOCX Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert PDF to Word (DOCX) documents online instantly, maintaining formatting - free and secure with no signup required.',
  keywords: [
    'PDF to Word',
    'PDF to DOCX',
    'convert PDF to Word',
    'PDF converter',
    'free PDF tools',
    'PDF to Word online',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}pdf-to-word`,
  },
  openGraph: {
    title: `Convert PDF to Word - Free & Secure PDF Converter | ${process.env.SITE_NAME}`,
    description:
      'Transform PDFs into editable Word documents while preserving layout and formatting. Fast and free conversion.',
    url: `${process.env.SITE_URL_TOOLS}pdf-to-word`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert PDF to Word Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert PDF to Word - Free & Secure PDF Converter | ${process.env.SITE_NAME}`,
    description: 'Convert PDF to Word documents instantly while maintaining formatting - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      PDF to Word Page Component
---------------------------------------------------------------*/
export default function PdfToWordPage(): JSX.Element {
  return <PdfToWordClient />;
}
