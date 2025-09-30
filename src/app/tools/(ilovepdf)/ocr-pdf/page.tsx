import type { Metadata } from 'next';
import { type JSX } from 'react';
import OcrPdfClient from '@/app/tools/(ilovepdf)/ocr-pdf/OcrPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `OCR PDF - Convert Scanned PDF to Searchable Text | ${process.env.SITE_NAME}`,
  description:
    'Convert scanned PDFs to searchable text online instantly, securely, and for free - no signup or installation required.',
  keywords: ['OCR PDF', 'PDF OCR', 'convert scanned PDF to text', 'make PDF searchable', 'free PDF tools', 'PDFMaking'],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}ocr-pdf`,
  },
  openGraph: {
    title: `OCR PDF - Free & Secure PDF Text Recognition | ${process.env.SITE_NAME}`,
    description: 'Convert scanned PDFs to searchable text easily and securely. Fast online OCR tool with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}ocr-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `OCR PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `OCR PDF - Free & Secure PDF Text Recognition | ${process.env.SITE_NAME}`,
    description: 'Convert scanned PDFs to searchable text instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      OCR PDF Page Component
---------------------------------------------------------------*/
export default function OcrPdfPage(): JSX.Element {
  return <OcrPdfClient />;
}
