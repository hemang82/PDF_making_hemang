import type { Metadata } from 'next';
import { type JSX } from 'react';
import ExcelToPdfClient from '@/app/tools/(ilovepdf)/excel-to-pdf/ExcelToPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert Excel to PDF - Free XLSX to PDF Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert Excel spreadsheets (XLS/XLSX) to PDF online instantly, maintaining formatting - free and secure with no signup required.',
  keywords: [
    'Excel to PDF',
    'XLSX to PDF',
    'XLS to PDF',
    'convert Excel to PDF',
    'spreadsheet converter',
    'free PDF tools',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}excel-to-pdf`,
  },
  openGraph: {
    title: `Convert Excel to PDF - Free & Secure Spreadsheet Converter | ${process.env.SITE_NAME}`,
    description:
      'Transform Excel spreadsheets into PDFs while preserving layout and formatting. Fast and free conversion.',
    url: `${process.env.SITE_URL_TOOLS}excel-to-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert Excel to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert Excel to PDF - Free & Secure Spreadsheet Converter | ${process.env.SITE_NAME}`,
    description: 'Convert Excel spreadsheets to PDF instantly while maintaining formatting - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Excel to PDF Page Component
---------------------------------------------------------------*/
export default function ExcelToPdfPage(): JSX.Element {
  return <ExcelToPdfClient />;
}
