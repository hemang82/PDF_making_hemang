import type { Metadata } from 'next';
import { type JSX } from 'react';
import RemovePagesClient from '@/app/tools/(ilovepdf)/remove-pages/RemovePagesClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Remove Pages from PDF - Free PDF Page Remover | ${process.env.SITE_NAME}`,
  description: 'Easily remove pages from your PDF files online for free. Fast, secure, and no sign-up required.',
  keywords: [
    'remove PDF pages',
    'delete PDF pages',
    'PDF page remover',
    'edit PDF',
    process.env.SITE_NAME || 'PDF Tool',
    'remove pages from PDF online',
    'free PDF tools',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}remove-pages`,
  },
  openGraph: {
    title: `Remove Pages from PDF - Free PDF Page Remover | ${process.env.SITE_NAME}`,
    description: 'Delete pages from your PDF documents instantly and securely. No watermark, no installation.',
    url: `${process.env.SITE_URL_TOOLS}remove-pages`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Remove PDF Pages Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Remove Pages from PDF - Free PDF Page Remover | ${process.env.SITE_NAME}`,
    description: 'Remove unwanted pages from your PDF files quickly and securely - no installation, no watermark.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Remove Pages Page Component
---------------------------------------------------------------*/
export default function RemovePagesPage(): JSX.Element {
  return <RemovePagesClient />;
}
