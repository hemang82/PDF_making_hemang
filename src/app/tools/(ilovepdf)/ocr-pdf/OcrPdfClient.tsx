'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import DownloadScreen from '@/components/common/DownloadScreen';
import PageSection from '@/components/common/PageSection';
import UploadScreen from '@/components/common/UploadScreen';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/ocr-pdf/PreviewScreen'), { ssr: false });

/*---------------------------------------------------------------
                      Constant Prop Bundles
---------------------------------------------------------------*/
const CONFIG_PROPS = Object.freeze({
  accept: { 'application/pdf': ['.pdf'] },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 3,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 50 MB
});

const UPLOAD_SCREEN_PROPS = {
  ...CONFIG_PROPS,
  title: 'OCR PDF',
  description: 'Convert scanned PDFs into searchable documents using OCR.',
  buttonLabel: 'Select PDF files',
  dropContainerLabel: 'or drop PDFs here',
};

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'OCR PDF',
  buttonLabel: 'OCR PDF',
  fileNameAddOn: 'optimized',
  tool: 'pdfocr',
  toolName: 'OCR Pdf',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF is Now Searchable!',
  buttonLabel: 'Download Optimized',
  apiType: 'ilovepdf',
  fileNameAddOn: 'optimized',
});

/*---------------------------------------------------------------
                      Compress PDF Client Component
---------------------------------------------------------------*/
const OcrPdfClient = (): JSX.Element => {
  const screenType = useCustomPdfToolStore((state) => state.screenType);

  const renderScreen = (): JSX.Element => {
    switch (screenType) {
      case 'preview':
        return <PreviewScreen {...PREVIEW_SCREEN_PROPS} />;

      case 'download':
        return <DownloadScreen {...DOWNLOAD_SCREEN_PROPS} />;

      default:
        return <UploadScreen {...UPLOAD_SCREEN_PROPS} />;
    }
  };

  return <PageSection>{renderScreen()}</PageSection>;
};

export default OcrPdfClient;
