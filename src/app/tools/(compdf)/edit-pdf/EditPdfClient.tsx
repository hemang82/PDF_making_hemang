'use client';

import PageSection from '@/components/common/PageSection';
import CustomUploadScreen from '@/components/common/UploadScreen';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';
import dynamic from 'next/dynamic';
import { type JSX } from 'react';
import ApryseWebViewer from '@/components/tools/edit-pdf/ApryseWebViewer';
import CustomDownloadScreen from '@/components/common/DownloadScreen';

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
  title: 'Edit PDF Files',
  description: 'Edit PDF by adding text, shapes, comments and highlights. Your secure and simple tool to edit PDF.',
  buttonLabel: 'Select PDF files',
  dropContainerLabel: 'or drop PDFs here',
});

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'Edit PDF',
  buttonLabel: 'Edit PDF',
  fileNameAddOn: 'edit',
  tool: 'Edit',
  toolName: 'Edit PDF',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDFs Have Been Edit!',
  buttonLabel: 'Download Edit PDF',
  apiType: 'apryse',
  fileNameAddOn: 'edit',
});

export const EditPdfClient = (): JSX.Element => {
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
