import type { Metadata } from 'next';
import { type JSX } from 'react';
import PdfToExcelClient from '@/app/tools/(adobe)/pdf-to-excel/PdfToExcelClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert PDF to Excel - Free PDF to XLSX Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert PDF to Excel spreadsheets online instantly, maintaining tables and formatting - free and secure with no signup required.',
  keywords: [
    'PDF to Excel',
    'PDF to XLSX',
    'convert PDF to Excel',
    'PDF converter',
    'free PDF tools',
    'PDF to spreadsheet',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}pdf-to-excel`,
  },
  openGraph: {
    title: `Convert PDF to Excel - Free & Secure PDF Converter | ${process.env.SITE_NAME}`,
    description:
      'Transform PDFs into editable Excel spreadsheets while preserving tables and formatting. Fast and free conversion.',
    url: `${process.env.SITE_URL_TOOLS}pdf-to-excel`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert PDF to Excel Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert PDF to Excel - Free & Secure PDF Converter | ${process.env.SITE_NAME}`,
    description: 'Convert PDF to Excel spreadsheets instantly while maintaining formatting - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      PDF to Excel Page Component
---------------------------------------------------------------*/
export default function PdfToExcelPage(): JSX.Element {
  return <PdfToExcelClient />;
}
