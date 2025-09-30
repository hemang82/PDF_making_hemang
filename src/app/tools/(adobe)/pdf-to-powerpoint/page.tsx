import type { Metadata } from 'next';
import { type JSX } from 'react';
import PdfToPptClient from '@/app/tools/(adobe)/pdf-to-powerpoint/PdfToPptClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert PDF to PowerPoint - Free PDF to PPT Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert PDF to PowerPoint presentations online instantly, maintaining slides and formatting - free and secure with no signup required.',
  keywords: [
    'PDF to PowerPoint',
    'PDF to PPT',
    'convert PDF to PowerPoint',
    'PDF converter',
    'free PDF tools',
    'PDF to PPT online',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}pdf-to-powerpoint`,
  },
  openGraph: {
    title: `Convert PDF to PowerPoint - Free & Secure PDF Converter | ${process.env.SITE_NAME}`,
    description:
      'Transform PDFs into editable PowerPoint presentations while preserving layout and formatting. Fast and free conversion.',
    url: `${process.env.SITE_URL_TOOLS}pdf-to-powerpoint`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert PDF to PowerPoint Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert PDF to PowerPoint - Free & Secure PDF Converter | ${process.env.SITE_NAME}`,
    description: 'Convert PDF to PowerPoint presentations instantly while maintaining formatting - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      PDF to PowerPoint Page Component
---------------------------------------------------------------*/
export default function PdfToPptPage(): JSX.Element {
  return <PdfToPptClient />;
}
