'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import CustomDownloadScreen from '@/components/common/DownloadScreen';
import CustomUploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/merge-pdf/PreviewScreen'), { ssr: false });

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
  title: 'Merge PDF Files',
  description: 'Combine PDFs in any order with our fast, secure PDF merger.',
  buttonLabel: 'Select PDF files',
  dropContainerLabel: 'or drop PDFs here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Merge PDF',
  buttonLabel: 'Merge PDF',
  fileNameAddOn: 'merged',
  tool: 'merge',
  toolName: 'Merge PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDFs Have Been Merged!',
  buttonLabel: 'Download Merged PDF',
  apiType: 'ilovepdf',
  fileNameAddOn: 'merged',
});

/*---------------------------------------------------------------
                      Merge PDF Client Component
---------------------------------------------------------------*/

const MergePdfClient = (): JSX.Element => {

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

export default MergePdfClient;
