'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import CustomDownloadScreen from '@/components/common/DownloadScreen';
import CustomUploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/compare-pdf/PreviewScreen'), { ssr: false });

/*---------------------------------------------------------------
                      Constant Prop Bundles
---------------------------------------------------------------*/
const CONFIG_PROPS = {
  accept: { 'application/pdf': ['.pdf'] },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 2,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 50 MB
};

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Compare PDF Files',
  description: 'Upload two PDF files to compare and find differences.',
  buttonLabel: 'Select PDF files',
  dropContainerLabel: 'or drop PDFs here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Compare PDFs',
  buttonLabel: 'Compare Files',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF Comparison Complete!',
  buttonLabel: 'Download Comparison Report',
});

/*---------------------------------------------------------------
                      Compare PDF Client Component
---------------------------------------------------------------*/
const ComparePdfClient = (): JSX.Element => {
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

export default ComparePdfClient;
