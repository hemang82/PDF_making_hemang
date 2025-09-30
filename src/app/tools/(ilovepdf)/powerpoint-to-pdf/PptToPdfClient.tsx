'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import DownloadScreen from '@/components/common/DownloadScreen';
import UploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/office-to-pdf/PreviewScreen'), { ssr: false });

/*---------------------------------------------------------------
                      Constant Prop Bundles
---------------------------------------------------------------*/
const CONFIG_PROPS = Object.freeze({
  accept: {
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 3,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 50 MB
});

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Convert PowerPoint to PDF',
  description: 'Transform your PowerPoint presentation into a PDF while preserving formatting.',
  buttonLabel: 'Select PowerPoint file',
  dropContainerLabel: 'or drop PowerPoint file here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'PowerPoint to PDF',
  buttonLabel: 'Convert to PDF',
  fileNameAddOn: 'converted',
  tool: 'officepdf',
  toolName: 'PowerPoint to PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PowerPoint File Has Been Converted!',
  buttonLabel: 'Download Converted',
  apiType: 'ilovepdf',
  fileNameAddOn: 'converted',
});

/*---------------------------------------------------------------
                      PowerPoint to PDF Client Component
---------------------------------------------------------------*/
const PptToPdfClient = (): JSX.Element => {
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

export default PptToPdfClient;
