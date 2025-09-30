'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import CustomDownloadScreen from '@/components/common/DownloadScreen';
import CustomUploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/protect-pdf/PreviewScreen'), { ssr: false });

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
  title: 'Protect PDF Document',
  description: 'Add password protection to your PDF file securely.',
  buttonLabel: 'Select PDF file',
  dropContainerLabel: 'or drop PDF here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Protect PDF',
  buttonLabel: 'Save Protected PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF Has Been Protected!',
  buttonLabel: 'Download Protected PDF',
});

/*---------------------------------------------------------------
                      Protect PDF Client Component
---------------------------------------------------------------*/
const ProtectPdfClient = (): JSX.Element => {
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

export default ProtectPdfClient;
