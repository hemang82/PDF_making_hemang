import type { Metadata } from 'next';
import { type JSX } from 'react';
// import ComparePdfClient from '@/app/tools/compare-pdf/ComparePdfClient'; // This file integrated with custom python backend
import EditPdf from '@/components/tools/edit-pdf/EditPdf';
import ComparePdfClient from './ComparePdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Compare PDF Files - Free Online PDF Comparison Tool | ${process.env.SITE_NAME}`,
  description: 'Compare PDF files online instantly, securely, and for free - no signup or installation required.',
  keywords: ['compare PDF', 'PDF comparison', 'PDF diff', 'compare PDF files', 'free PDF tools', 'PDFMaking'],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}compare-pdf`,
  },
  openGraph: {
    title: `Compare PDF Files - Free & Secure PDF Comparison | ${process.env.SITE_NAME}`,
    description: 'Compare PDF files easily and securely. Fast online PDF comparison tool with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}compare-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Compare PDF Files Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Compare PDF Files - Free & Secure PDF Comparison | ${process.env.SITE_NAME}`,
    description: 'Compare PDF files instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Compare PDF Page Component
---------------------------------------------------------------*/
export default function ComparePdfPage(): JSX.Element {
  // return <EditPdf />;
  return <ComparePdfClient />;

}
