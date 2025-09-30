'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import DownloadScreen from '@/components/common/DownloadScreen';
import PageSection from '@/components/common/PageSection';
import UploadScreen from '@/components/common/UploadScreen';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/jpg-to-pdf/PreviewScreen'), { ssr: false });

/*---------------------------------------------------------------
                      Constant Prop Bundles
---------------------------------------------------------------*/
const CONFIG_PROPS = Object.freeze({
  accept: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 3,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 50 MB
});

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Convert JPG to PDF',
  description: 'Transform your JPG images into a PDF file. Combine multiple JPG images into one PDF.',
  buttonLabel: 'Select JPG images',
  dropContainerLabel: 'or drop JPG images here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'JPG to PDF',
  buttonLabel: 'Convert to PDF',
  fileNameAddOn: 'converted',
  tool: 'imagepdf',
  toolName: 'JPG to PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'JPG Images Have Been Converted!',
  buttonLabel: 'Download Converted PDF',
  apiType: 'ilovepdf',
  fileNameAddOn: 'converted',
});

/*---------------------------------------------------------------
                      JPG to PDF Client Component
---------------------------------------------------------------*/
const JpgToPdfClient = (): JSX.Element => {
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

export default JpgToPdfClient;
