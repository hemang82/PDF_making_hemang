import type { Metadata } from 'next';
import { type JSX } from 'react';
import RotatePdfClient from '@/app/tools/(ilovepdf)/rotate-pdf/RotatePdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Rotate PDF Pages - Free PDF Rotation Tool | ${process.env.SITE_NAME}`,
  description:
    'Rotate PDF pages online instantly - change page orientation easily and for free with no signup required.',
  keywords: [
    'rotate PDF',
    'PDF rotation',
    'change PDF orientation',
    'rotate PDF pages',
    'free PDF tools',
    'PDF editor',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}rotate-pdf`,
  },
  openGraph: {
    title: `Rotate PDF Pages - Free & Secure PDF Rotation Tool | ${process.env.SITE_NAME}`,
    description: 'Rotate PDF pages and change orientation easily. Fast online PDF rotation with no restrictions.',
    url: `${process.env.SITE_URL_TOOLS}rotate-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Rotate PDF Pages Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Rotate PDF Pages - Free & Secure PDF Rotation Tool | ${process.env.SITE_NAME}`,
    description: 'Rotate PDF pages and change orientation instantly - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Rotate PDF Page Component
---------------------------------------------------------------*/
export default function RotatePdfPage(): JSX.Element {
  return <RotatePdfClient />;
}
