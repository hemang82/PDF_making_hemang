'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import DownloadScreen from '@/components/common/DownloadScreen';
import PageSection from '@/components/common/PageSection';
import UploadScreen from '@/components/common/UploadScreen';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/pdf-to-jpg/PreviewScreen'), { ssr: false });

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
  title: 'Convert PDF to JPG',
  description: 'Transform your PDF into high-quality JPG images, one image per page.',
  buttonLabel: 'Select PDF file',
  dropContainerLabel: 'or drop PDF here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'PDF to JPG',
  buttonLabel: 'Convert to JPG',
  fileNameAddOn: 'converted',
  tool: 'pdfjpg',
  toolName: 'PDF to JPG',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF Has Been Converted!',
  buttonLabel: 'Download Converted PDF',
  apiType: 'ilovepdf',
  fileNameAddOn: 'converted',
});

/*---------------------------------------------------------------
                      PDF to JPG Client Component
---------------------------------------------------------------*/
const PdfToJpgClient = (): JSX.Element => {
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

export default PdfToJpgClient;
