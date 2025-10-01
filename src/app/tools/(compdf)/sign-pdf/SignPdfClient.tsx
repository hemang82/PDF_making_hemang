'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import CustomDownloadScreen from '@/components/common/DownloadScreen';
import CustomUploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';
import ApryseWebViewer from '@/components/tools/edit-pdf/ApryseWebViewer.js';

const PreviewScreen = dynamic(() => import('@/components/tools/merge-pdf/CustomAPIPreviewScreen'), { ssr: false });

/*---------------------------------------------------------------
                      Constant Prop Bundles
---------------------------------------------------------------*/
const CONFIG_PROPS = Object.freeze({
  accept: { 'application/pdf': ['.pdf'] },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 3,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 100 MB
});

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Sign PDF Document',
  description: 'Add your digital signature to PDF documents securely.',
  buttonLabel: 'Select PDF file',
  dropContainerLabel: 'or drop PDF here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Sign PDF',
  buttonLabel: 'Save Signed PDF',
  fileNameAddOn: 'Sign',
  tool: 'Sign',
  toolName: 'Sign PDF',
  description: 'Add your digital signature to PDF documents securely.',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF Has Been Signed!',
  buttonLabel: 'Download Signed PDF',
  apiType: 'apryse',
  fileNameAddOn: 'sign',
});

/*---------------------------------------------------------------
                      Sign PDF Client Component
---------------------------------------------------------------*/
const SignPdfClient = (): JSX.Element => {
  const screenType = useCustomPdfToolStore((state) => state.screenType);

  const renderScreen = (): JSX.Element => {
    switch (screenType) {
      case 'preview':
        // return <PreviewScreen {...PREVIEW_SCREEN_PROPS} />;
        return <ApryseWebViewer {...PREVIEW_SCREEN_PROPS} />;

      case 'download':
        return <CustomDownloadScreen {...DOWNLOAD_SCREEN_PROPS} />;

      default:
        return <CustomUploadScreen {...UPLOAD_SCREEN_PROPS} />;
    }
  };

  return <PageSection>{renderScreen()}</PageSection>;
};

export default SignPdfClient;
