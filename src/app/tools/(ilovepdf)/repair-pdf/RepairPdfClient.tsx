'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import DownloadScreen from '@/components/common/DownloadScreen';
import PageSection from '@/components/common/PageSection';
import UploadScreen from '@/components/common/UploadScreen';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/repair-pdf/PreviewScreen'), { ssr: false });

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

const UPLOAD_SCREEN_PROPS = {
  ...CONFIG_PROPS,
  title: 'Repair PDF File',
  description: 'Fix corrupted or damaged PDF files with our secure PDF repair tool.',
  buttonLabel: 'Select PDF files',
  dropContainerLabel: 'or drop PDFs here',
};

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Repair PDF',
  buttonLabel: 'Repair PDF',
  fileNameAddOn: 'repaired',
  tool: 'repair',
  toolName: 'Repair PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF Has Been Repaired!',
  buttonLabel: 'Download Repaired PDF',
  apiType: 'ilovepdf',
  fileNameAddOn: 'repaired',
});

/*---------------------------------------------------------------
                      Repair PDF Client Component
---------------------------------------------------------------*/
const RepairPdfClient = (): JSX.Element => {
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

export default RepairPdfClient;
