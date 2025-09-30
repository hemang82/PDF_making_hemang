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
  accept: { 'application/pdf': ['.pdf'] },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 2,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 100 MB
});

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Add Watermark to PDF',
  description: 'Add text or image watermarks to your PDF documents.',
  buttonLabel: 'Select PDF file',
  dropContainerLabel: 'or drop PDF here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Watermark PDF',
  buttonLabel: 'Apply Watermark',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'Watermark Has Been Added!',
  buttonLabel: 'Download Watermarked PDF',
});

/*---------------------------------------------------------------
                      Watermark PDF Client Component
---------------------------------------------------------------*/
const WatermarkPdfClient = (): JSX.Element => {
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

export default WatermarkPdfClient;
