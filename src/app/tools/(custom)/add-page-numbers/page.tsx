import type { Metadata } from 'next';
import { type JSX } from 'react';
import AddPageNumbersClient from '@/app/tools/(custom)/add-page-numbers/AddPageNumbersClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Add Page Numbers to PDF - Free Online PDF Page Numbering | ${process.env.SITE_NAME}`,
  description:
    'Add page numbers to PDF files online instantly, securely, and for free - no signup or installation required.',
  keywords: [
    'add page numbers to PDF',
    'PDF page numbering',
    'insert page numbers',
    'PDF pagination',
    'free PDF tools',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}add-page-numbers`,
  },
  openGraph: {
    title: `Add Page Numbers to PDF - Free & Secure PDF Numbering | ${process.env.SITE_NAME}`,
    description:
      'Add page numbers to PDF files easily and securely. Fast online PDF page numbering tool with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}add-page-numbers`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Add Page Numbers to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Add Page Numbers to PDF - Free & Secure PDF Numbering | ${process.env.SITE_NAME}`,
    description: 'Add page numbers to PDF files instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Add Page Numbers Page Component
---------------------------------------------------------------*/
export default function AddPageNumbersPage(): JSX.Element {
  return <AddPageNumbersClient />;
}
