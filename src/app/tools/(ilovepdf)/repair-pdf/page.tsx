import type { Metadata } from 'next';
import { type JSX } from 'react';
import RepairPdfClient from '@/app/tools/(ilovepdf)/repair-pdf/RepairPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Repair PDF Files - Free Online PDF Repair Tool | ${process.env.SITE_NAME}`,
  description:
    'Fix and repair corrupted PDF files online instantly, securely, and for free - no signup or installation required.',
  keywords: ['repair PDF', 'fix PDF', 'corrupted PDF repair', 'fix broken PDF', 'free PDF tools', 'PDFMaking'],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}repair-pdf`,
  },
  openGraph: {
    title: `Repair PDF Files - Free & Secure PDF Repair Tool | ${process.env.SITE_NAME}`,
    description: 'Fix corrupted PDF files easily and securely. Fast online PDF repair tool with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}repair-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Repair PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Repair PDF Files - Free & Secure PDF Repair Tool | ${process.env.SITE_NAME}`,
    description: 'Fix corrupted PDF files instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Repair PDF Page Component
---------------------------------------------------------------*/
export default function RepairPdfPage(): JSX.Element {
  return <RepairPdfClient />;
}
