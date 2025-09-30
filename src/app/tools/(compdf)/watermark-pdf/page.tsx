import type { Metadata } from 'next';
import { type JSX } from 'react';
// import WatermarkPdfClient from '@/app/tools/watermark-pdf/WatermarkPdfClient'; // This file integrated with custom python backend
import EditPdf from '@/components/tools/edit-pdf/EditPdf';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Add Watermark to PDF - Free PDF Watermark Tool | ${process.env.SITE_NAME}`,
  description:
    'Add text or image watermarks to PDF documents online instantly - customize and protect your PDFs for free with no signup required.',
  keywords: [
    'watermark PDF',
    'add watermark',
    'PDF watermark',
    'text watermark',
    'image watermark',
    'free PDF tools',
    process.env.SITE_NAME || 'PDF Tool',
  ],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}watermark-pdf`,
  },
  openGraph: {
    title: `Add Watermark to PDF - Free & Secure PDF Watermark Tool | ${process.env.SITE_NAME}`,
    description:
      'Add custom watermarks to your PDF documents easily and securely. Fast online PDF watermarking with no restrictions.',
    url: `${process.env.SITE_URL_TOOLS}watermark-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Add Watermark to PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Add Watermark to PDF - Free & Secure PDF Watermark Tool | ${process.env.SITE_NAME}`,
    description: 'Add text or image watermarks to PDF documents instantly and securely - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Watermark PDF Page Component
---------------------------------------------------------------*/
export default function WatermarkPdfPage(): JSX.Element {
  return <EditPdf />;
}
