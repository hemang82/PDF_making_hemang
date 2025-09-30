import type { Metadata } from 'next';
import { type JSX } from 'react';
import UnlockPdfClient from '@/app/tools/(custom)/unlock-pdf/UnlockPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Unlock PDF - Free PDF Password Remover | ${process.env.SITE_NAME}`,
  description:
    'Remove password protection from PDF files online instantly - unlock PDFs securely and for free with no signup required.',
  keywords: [
    'unlock PDF',
    'remove PDF password',
    'PDF password remover',
    'decrypt PDF',
    'free PDF tools',
    'PDF unlocker',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}unlock-pdf`,
  },
  openGraph: {
    title: `Unlock PDF - Free & Secure PDF Password Remover | ${process.env.SITE_NAME}`,
    description:
      'Remove password protection from PDF files easily and securely. Fast online PDF unlocking with no restrictions.',
    url: `${process.env.SITE_URL_TOOLS}unlock-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Unlock PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Unlock PDF - Free & Secure PDF Password Remover | ${process.env.SITE_NAME}`,
    description: 'Remove password protection from PDF files instantly and securely - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Unlock PDF Page Component
---------------------------------------------------------------*/
export default function UnlockPdfPage(): JSX.Element {
  return <UnlockPdfClient />;
}
