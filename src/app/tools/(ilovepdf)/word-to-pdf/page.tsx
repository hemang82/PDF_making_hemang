import type { Metadata } from 'next';
import { type JSX } from 'react';
import WordToPdfClient from '@/app/tools/(ilovepdf)/word-to-pdf/WordToPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Convert Word to PDF - Free DOCX to PDF Converter | ${process.env.SITE_NAME}`,
  description:
    'Convert Word documents (DOCX) to PDF online instantly, maintaining formatting - free and secure with no signup required.',
  keywords: [
    'Word to PDF',
    'DOCX to PDF',
    'convert Word to PDF',
    'document converter',
    'free PDF tools',
    'Word converter online',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}word-to-pdf`,
  },
  openGraph: {
    title: `Convert Word to PDF - Free & Secure Document Converter | ${process.env.SITE_NAME}`,
    description: 'Transform Word documents into PDFs while preserving layout and formatting. Fast and free conversion.',
    url: `${process.env.SITE_URL_TOOLS}word-to-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Convert Word to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Convert Word to PDF - Free & Secure Document Converter | ${process.env.SITE_NAME}`,
    description: 'Convert Word documents to PDF instantly while maintaining formatting - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Word to PDF Page Component
---------------------------------------------------------------*/
export default function WordToPdfPage(): JSX.Element {
  return <WordToPdfClient />;
}
