import type { Metadata } from 'next';
import { type JSX } from 'react';
import SplitPdfClient from '@/app/tools/(other)/custom-split-pdf/SplitPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Split PDF Files - Free PDF Splitter | ${process.env.SITE_NAME}`,
  description:
    'Split PDF files into individual pages or custom ranges instantly, securely, and for free - no signup or installation required.',
  keywords: [
    'split PDF',
    'PDF splitter',
    'separate PDF pages',
    'split PDF files online',
    'free PDF tools',
    'PDF editor',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}split-pdf`,
  },
  openGraph: {
    title: `Split PDF Files - Free & Secure PDF Splitter | ${process.env.SITE_NAME}`,
    description:
      'Split PDF files into separate documents easily and securely. Fast online PDF splitter with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}split-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Split PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Split PDF Files - Free & Secure PDF Splitter | ${process.env.SITE_NAME}`,
    description:
      'Split PDF files into individual pages or custom ranges instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Split PDF Page Component
---------------------------------------------------------------*/
export default function SplitPdfPage(): JSX.Element {
  return <SplitPdfClient />;
}
