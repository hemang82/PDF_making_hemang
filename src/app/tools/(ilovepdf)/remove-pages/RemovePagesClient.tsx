'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import CustomDownloadScreen from '@/components/common/DownloadScreen';
import CustomUploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/remove-pages/PreviewScreen'), { ssr: false });

/*---------------------------------------------------------------
                      Constant Prop Bundles
---------------------------------------------------------------*/
const CONFIG_PROPS = Object.freeze({
  accept: { 'application/pdf': ['.pdf'] },
  multiple: false,
  isCheckPdfPasswordProtected: true,
  filesLimit: 1,
  maxFileSizePerTaskInBytes: 10 * 1024 * 1024, // 10 MB
});

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Remove PDF Pages',
  description: 'Upload your PDF and delete unwanted pages easily and securely.',
  buttonLabel: 'Select a PDF file',
  dropContainerLabel: 'or drop your PDF here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Remove Pages from PDF',
  buttonLabel: 'Apply Changes',
  fileNameAddOn: 'removed',
  tool: 'split',
  toolName: 'Remove Pages',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'Your PDF Has Been Updated!',
  buttonLabel: 'Download Updated PDF',
  apiType: 'ilovepdf',
  fileNameAddOn: 'removed',
});

/*---------------------------------------------------------------
                      Merge PDF Client Component
---------------------------------------------------------------*/
const RemovePagesClient = (): JSX.Element => {
  const screenType = useCustomPdfToolStore((state) => state.screenType);

  const renderScreen = (): JSX.Element => {
    switch (screenType) {
      case 'preview':
        return <PreviewScreen {...PREVIEW_SCREEN_PROPS} />;

      case 'download':
        return <CustomDownloadScreen {...DOWNLOAD_SCREEN_PROPS} />;

      default:
        return <CustomUploadScreen {...UPLOAD_SCREEN_PROPS} />;
    }
  };

  return <PageSection>{renderScreen()}</PageSection>;
};

export default RemovePagesClient;
