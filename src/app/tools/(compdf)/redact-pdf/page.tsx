import type { Metadata } from 'next';
import { type JSX } from 'react';
// import RedactPdfClient from '@/app/tools/redact-pdf/RedactPdfClient'; // This file integrated with custom python backend
import EditPdf from '@/components/tools/edit-pdf/EditPdf';
import RedactPdfClient from './RedactPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Redact PDF Files - Free Online PDF Redaction Tool | ${process.env.SITE_NAME}`,
  description:
    'Redact sensitive information from PDF files online instantly, securely, and for free - no signup or installation required.',
  keywords: [
    'redact PDF',
    'PDF redaction',
    'remove sensitive information',
    'PDF blackout',
    'free PDF tools',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}redact-pdf`,
  },
  openGraph: {
    title: `Redact PDF Files - Free & Secure PDF Redaction | ${process.env.SITE_NAME}`,
    description:
      'Redact sensitive information from PDF files easily and securely. Fast online PDF redaction tool with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}redact-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Redact PDF Files Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Redact PDF Files - Free & Secure PDF Redaction | ${process.env.SITE_NAME}`,
    description: 'Redact sensitive information from PDF files instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Redact PDF Page Component
---------------------------------------------------------------*/
export default function RedactPdfPage(): JSX.Element {
  // return <EditPdf />;
  return <RedactPdfClient />
}
