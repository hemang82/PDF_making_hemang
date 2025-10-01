import type { Metadata } from 'next';
import { type JSX } from 'react';
import EditPdf from '@/components/tools/edit-pdf/EditPdf';
import ApryseWebViewer from '@/components/tools/edit-pdf/ApryseWebViewer';
import { EditPdfClient } from './EditPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/

export const metadata: Metadata = {
  title: `Edit PDF Files - Free Online PDF Editor | ${process.env.SITE_NAME}`,
  description: 'Edit PDF files online instantly, securely, and for free - no signup or installation required.',
  keywords: ['edit PDF', 'PDF editor', 'modify PDF', 'edit PDF files online', 'free PDF tools', 'PDFMaking'],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}edit-pdf`,
  },
  openGraph: {
    title: `Edit PDF Files - Free & Secure PDF Editor | ${process.env.SITE_NAME}`,
    description: 'Edit and modify PDF files easily and securely. Fast online PDF editor with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}edit-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Edit PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Edit PDF Files - Free & Secure PDF Editor | ${process.env.SITE_NAME}`,
    description: 'Edit PDF files instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Edit PDF Page Component
---------------------------------------------------------------*/

export default function EditPdfPage(): JSX.Element {
  return <EditPdfClient />;
}
