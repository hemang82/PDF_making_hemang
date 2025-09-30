import type { Metadata } from 'next';
import { type JSX } from 'react';
import HtmlToPdfClient from '@/app/tools/(ilovepdf)/html-to-pdf/HtmlToPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert HTML to PDF - Free HTML to PDF Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert HTML content or web pages to PDF documents online instantly - free and secure with no signup required.',
  keywords: [
    'HTML to PDF',
    'convert HTML to PDF',
    'web page to PDF',
    'HTML converter',
    'free PDF tools',
    'webpage to PDF',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}html-to-pdf`,
  },
  openGraph: {
    title: `Convert HTML to PDF - Free & Secure HTML Converter | ${process.env.SITE_NAME}`,
    description:
      'Transform HTML content and web pages into PDF documents. Fast and free conversion with perfect formatting.',
    url: `${process.env.SITE_URL_TOOLS}html-to-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert HTML to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert HTML to PDF - Free & Secure HTML Converter | ${process.env.SITE_NAME}`,
    description: 'Convert HTML content and web pages to PDF documents instantly - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      HTML to PDF Page Component
---------------------------------------------------------------*/
export default function HtmlToPdfPage(): JSX.Element {
  return <HtmlToPdfClient />;
}
