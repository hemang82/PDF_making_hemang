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
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 3,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 50 MB
});

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Convert Word to PDF',
  description: 'Transform your Word document into a PDF while preserving formatting.',
  buttonLabel: 'Select Word file',
  dropContainerLabel: 'or drop Word file here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Word to PDF',
  buttonLabel: 'Convert to PDF',
  fileNameAddOn: 'converted',
  tool: 'officepdf',
  toolName: 'Word to PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'Word File Has Been Converted!',
  buttonLabel: 'Download Converted',
  apiType: 'ilovepdf',
  fileNameAddOn: 'converted',
});

/*---------------------------------------------------------------
                      Word to PDF Client Component
---------------------------------------------------------------*/
const WordToPdfClient = (): JSX.Element => {
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

export default WordToPdfClient;
