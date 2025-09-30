import type { Metadata } from 'next';
import { type JSX } from 'react';
import ScanToPdfClient from '@/app/tools/(other)/scan-to-pdf/ScanToPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert Scanned Images to PDF - Free Online Scan to PDF | ${process.env.SITE_NAME}`,
  description:
    'Convert scanned images to PDF files online instantly, securely, and for free - no signup or installation required.',
  keywords: [
    'scan to PDF',
    'convert images to PDF',
    'scanned document to PDF',
    'image to PDF converter',
    'free PDF tools',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}scan-to-pdf`,
  },
  openGraph: {
    title: `Convert Scanned Images to PDF - Free & Secure Scan to PDF | ${process.env.SITE_NAME}`,
    description:
      'Convert scanned images to PDF files easily and securely. Fast online scan to PDF converter with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}scan-to-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert Scanned Images to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert Scanned Images to PDF - Free & Secure Scan to PDF | ${process.env.SITE_NAME}`,
    description: 'Convert scanned images to PDF files instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Scan to PDF Page Component
---------------------------------------------------------------*/
export default function ScanToPdfPage(): JSX.Element {
  return <ScanToPdfClient />;
}
