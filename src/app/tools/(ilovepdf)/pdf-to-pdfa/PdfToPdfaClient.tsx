'use client';

import dynamic from 'next/dynamic';
import { type JSX } from 'react';

import DownloadScreen from '@/components/common/DownloadScreen';
import PageSection from '@/components/common/PageSection';
import UploadScreen from '@/components/common/UploadScreen';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const PreviewScreen = dynamic(() => import('@/components/tools/pdf-to-pdfa/PreviewScreen'), { ssr: false });

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
  title: 'Convert PDF to PDF/A',
  description: 'Convert PDF to PDF/A format for long-term archiving and compliance.',
  buttonLabel: 'Select PDF files',
  dropContainerLabel: 'or drop PDFs here',
};

const PREVIEW_SCREEN_PROPS = Object.freeze({
  ...CONFIG_PROPS,
  heading: 'PDF to PDF/A',
  buttonLabel: 'PDF to PDF/A',
  fileNameAddOn: 'converted',
  tool: 'pdfa',
  toolName: 'PDF to PDF/A',
});

const DOWNLOAD_SCREEN_PROPS = Object.freeze({
  pageHeading: 'PDF Has Been Converted to PDF/A!',
  buttonLabel: 'Download Converted PDF',
  apiType: 'ilovepdf',
  fileNameAddOn: 'converted',
});

/*---------------------------------------------------------------
                      Pdf To PdfA Client Component
---------------------------------------------------------------*/
const PdfToPdfAPage = (): JSX.Element => {
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

export default PdfToPdfAPage;
