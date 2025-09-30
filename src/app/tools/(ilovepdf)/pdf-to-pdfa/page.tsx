import type { Metadata } from 'next';
import { type JSX } from 'react';
import PdfToPdfaClient from '@/app/tools/(ilovepdf)/pdf-to-pdfa/PdfToPdfaClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert PDF to PDF/A - Free Online PDF/A Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert PDF to PDF/A format online instantly, securely, and for free - no signup or installation required.',
  keywords: [
    'PDF to PDF/A',
    'convert PDF to PDF/A',
    'PDF/A converter',
    'PDF archival format',
    'free PDF tools',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}pdf-to-pdfa`,
  },
  openGraph: {
    title: `Convert PDF to PDF/A - Free & Secure PDF/A Converter | ${process.env.SITE_NAME}`,
    description: 'Convert PDF to PDF/A format easily and securely. Fast online PDF/A converter with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}pdf-to-pdfa`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert PDF to PDF/A Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert PDF to PDF/A - Free & Secure PDF/A Converter | ${process.env.SITE_NAME}`,
    description: 'Convert PDF to PDF/A format instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      PDF to PDF/A Page Component
---------------------------------------------------------------*/
export default function PdfToPdfaPage(): JSX.Element {
  return <PdfToPdfaClient />;
}
