import type { Metadata } from 'next';
import { type JSX } from 'react';
import OrganizePdfClient from '@/app/tools/(other)/organize-pdf/OrganizePdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Organize PDF Pages - Free PDF Page Organizer | ${process.env.SITE_NAME}`,
  description:
    'Rearrange, delete, and organize PDF pages online instantly - reorder PDF pages for free with no signup required.',
  keywords: [
    'organize PDF',
    'rearrange PDF pages',
    'reorder PDF pages',
    'PDF page organizer',
    'free PDF tools',
    'PDF editor',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}organize-pdf`,
  },
  openGraph: {
    title: `Organize PDF Pages - Free & Secure PDF Page Organizer | ${process.env.SITE_NAME}`,
    description: 'Rearrange and organize PDF pages easily. Fast online PDF page organization with no restrictions.',
    url: `${process.env.SITE_URL_TOOLS}organize-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Organize PDF Pages Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Organize PDF Pages - Free & Secure PDF Page Organizer | ${process.env.SITE_NAME}`,
    description: 'Rearrange and organize PDF pages instantly - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Organize PDF Page Component
---------------------------------------------------------------*/
export default function OrganizePdfPage(): JSX.Element {
  return <OrganizePdfClient />;
}
