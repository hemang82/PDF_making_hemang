import type { Metadata } from 'next';
import { type JSX } from 'react';
import EditPdf from '@/components/tools/edit-pdf/EditPdf';
import CropPdfClient from './CropPdfClient';

/*---------------------------------------------------------------
                      Full Per Page SEO Metadata
---------------------------------------------------------------*/
export const metadata: Metadata = {
  title: `Crop PDF Files - Free Online PDF Cropper | ${process.env.SITE_NAME}`,
  description: 'Crop PDF files online instantly, securely, and for free - no signup or installation required.',
  keywords: ['crop PDF', 'PDF cropper', 'trim PDF', 'crop PDF files online', 'free PDF tools', 'PDFMaking'],
  alternates: {
    canonical: `${process.env.SITE_URL_TOOLS}crop-pdf`,
  },
  openGraph: {
    title: `Crop PDF Files - Free & Secure PDF Cropper | ${process.env.SITE_NAME}`,
    description: 'Crop and trim PDF files easily and securely. Fast online PDF cropper with no watermark.',
    url: `${process.env.SITE_URL_TOOLS}crop-pdf`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Crop PDF Online - ${process.env.SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Crop PDF Files - Free & Secure PDF Cropper | ${process.env.SITE_NAME}`,
    description: 'Crop PDF files instantly, securely, and for free - no signup required.',
    images: ['/og-image.png'],
  },
};

/*---------------------------------------------------------------
                      Crop PDF Page Component
---------------------------------------------------------------*/
export default function CropPdfPage(): JSX.Element {
  // return <EditPdf />;
  return <CropPdfClient />;

}
