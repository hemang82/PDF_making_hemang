import type { Metadata } from 'next';
import { type JSX } from 'react';
import ProtectPdfClient from '@/app/tools/(custom)/protect-pdf/ProtectPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Protect PDF - Free PDF Password Protection | ${process.env.SITE_NAME}`,
  description:
    'Add password protection to PDF files online instantly - secure PDFs with encryption for free with no signup required.',
  keywords: [
    'protect PDF',
    'password protect PDF',
    'encrypt PDF',
    'secure PDF',
    'free PDF tools',
    'PDF encryption',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}protect-pdf`,
  },
  openGraph: {
    title: `Protect PDF - Free & Secure PDF Password Protection | ${process.env.SITE_NAME}`,
    description:
      'Add password protection to your PDF files easily and securely. Fast online PDF encryption with no restrictions.',
    url: `${process.env.SITE_URL_TOOLS}protect-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Protect PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Protect PDF - Free & Secure PDF Password Protection | ${process.env.SITE_NAME}`,
    description: 'Add password protection to PDF files instantly and securely - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Protect PDF Page Component
---------------------------------------------------------------*/
export default function ProtectPdfPage(): JSX.Element {
  return <ProtectPdfClient />;
}
