'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import CustomDownloadScreen from '@/components/common/DownloadScreen';
import CustomUploadScreen from '@/components/common/UploadScreen';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/merge-pdf/CustomAPIPreviewScreen'), { ssr: false });

/*---------------------------------------------------------------
                      Constant Prop Bundles
---------------------------------------------------------------*/
const CONFIG_PROPS = Object.freeze({
  accept: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/tiff': ['.tiff', '.tif'],
  },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 3,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 100 MB
});

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Scan to PDF',
  description: 'Convert your scanned images or documents to PDF format.',
  buttonLabel: 'Select Scanned Images',
  dropContainerLabel: 'or drop scanned images here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Convert Scans to PDF',
  buttonLabel: 'Create PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF Created from Scans!',
  buttonLabel: 'Download PDF',
});

/*---------------------------------------------------------------
                      Scan to PDF Client Component
---------------------------------------------------------------*/
const ScanToPdfClient = (): JSX.Element => {
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

export default ScanToPdfClient;
