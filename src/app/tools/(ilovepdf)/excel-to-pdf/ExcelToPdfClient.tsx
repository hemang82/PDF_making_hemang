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
const CONFIG_PROPS = {
  accept: {
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  },
  multiple: true,
  isCheckPdfPasswordProtected: true,
  filesLimit: 3,
  maxFileSizePerTaskInBytes: 50 * 1024 * 1024, // 50 MB
};

const UPLOAD_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  title: 'Convert Excel to PDF',
  description: 'Transform your Excel spreadsheet into a PDF while preserving formatting.',
  buttonLabel: 'Select Excel file',
  dropContainerLabel: 'or drop Excel file here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Excel to PDF',
  buttonLabel: 'Convert to PDF',
  fileNameAddOn: 'converted',
  tool: 'officepdf',
  toolName: 'Excel to PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'Excel File Has Been Converted!',
  buttonLabel: 'Download Converted',
  apiType: 'ilovepdf',
  fileNameAddOn: 'converted',
});

/*---------------------------------------------------------------
                      Excel to PDF Client Component
---------------------------------------------------------------*/
const ExcelToPdfClient = (): JSX.Element => {
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

export default ExcelToPdfClient;
