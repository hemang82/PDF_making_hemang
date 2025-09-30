'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import DownloadScreen from '@/components/common/DownloadScreen';
import UploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/compress-pdf/PreviewScreen'), {
  ssr: false,
});

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

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Compress PDF Files',
  description: 'Reduce the file size of your PDFs while keeping the best quality. Fast, easy, and secure.',
  buttonLabel: 'Select PDF files',
  dropContainerLabel: 'or drop PDFs here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Compress PDF',
  buttonLabel: 'Compress PDF',
  fileNameAddOn: 'compressed',
  tool: 'compress',
  toolName: 'Compress',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDFs have been compressed!',
  buttonLabel: 'Download Compressed PDF',
  apiType: 'ilovepdf',
  fileNameAddOn: 'compressed',
});

/*---------------------------------------------------------------
                      Merge PDF Client Component
---------------------------------------------------------------*/
const CompressPdfClient = (): JSX.Element => {
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

export default CompressPdfClient;
