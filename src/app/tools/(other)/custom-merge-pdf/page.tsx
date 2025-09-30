import type { Metadata } from 'next';
import { type JSX } from 'react';
import MergePdfClient from '@/app/tools/(other)/custom-merge-pdf/MergePdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Merge PDF Files - Free PDF Merger | ${process.env.SITE_NAME}`,
  description:
    'Merge multiple PDFs into a single file instantly, securely, and for free - no signup or installation required.',
  keywords: [
    'merge PDF',
    'PDF merger',
    'combine PDFs',
    'merge PDF files online',
    'free PDF tools',
    'PDF editor',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}merge-pdf`,
  },
  openGraph: {
    title: `Merge PDF Files - Free & Secure PDF Merger | ${process.env.SITE_NAME}`,
    description: 'Combine multiple PDFs into one easily and securely. Fast online PDF merger with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}merge-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Merge PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Merge PDF Files - Free & Secure PDF Merger | ${process.env.SITE_NAME}`,
    description: 'Merge multiple PDFs into a single file instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Merge PDF Page Component
---------------------------------------------------------------*/
export default function MergePdfPage(): JSX.Element {
  return <MergePdfClient />;
}
