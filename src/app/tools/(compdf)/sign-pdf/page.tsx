import type { Metadata } from 'next';
import { type JSX } from 'react';
// import SignPdfClient from '@/app/tools/sign-pdf/SignPdfClient'; // This file integrated with custom python backend
import EditPdf from '@/components/tools/edit-pdf/EditPdf';
import SignPdfClient from './SignPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Sign PDF Online - Free PDF Signature Tool | ${process.env.SITE_NAME}`,
  description:
    'Add digital signatures to PDF documents online instantly - sign PDFs securely and for free with no signup required.',
  keywords: [
    'sign PDF',
    'PDF signature',
    'digital signature',
    'electronic signature',
    'free PDF tools',
    'PDF signer',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}sign-pdf`,
  },
  openGraph: {
    title: `Sign PDF Online - Free & Secure PDF Signature Tool | ${process.env.SITE_NAME}`,
    description:
      'Add digital signatures to your PDF documents easily and securely. Fast online PDF signing with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}sign-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Sign PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Sign PDF Online - Free & Secure PDF Signature Tool | ${process.env.SITE_NAME}`,
    description: 'Add digital signatures to PDF documents instantly and securely - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Sign PDF Page Component
---------------------------------------------------------------*/
export default function SignPdfPage(): JSX.Element {
  // return <EditPdf />;
  return <SignPdfClient />;
}
