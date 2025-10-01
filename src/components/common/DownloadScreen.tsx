/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import Image from 'next/image';
import { useState, type JSX } from 'react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import MyContainer from '@/components/common/MyContainer';
import { DOWNLOAD_PAGE_TOOLS } from '@/constants/pdfTools';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

interface CustomDownloadScreenProps {
  pageHeading: string;
  buttonLabel: string;
  apiType?: 'custom' | 'adobe' | 'ilovepdf' | 'apryse';
  fileNameAddOn?: string;
}

const CustomDownloadScreen = ({
  pageHeading,
  buttonLabel,
  apiType = 'custom',
  fileNameAddOn,
}: CustomDownloadScreenProps): JSX.Element => {
  const processedFileName = useCustomPdfToolStore((state) => state.processedFileName);
  const downloadInfo = useCustomPdfToolStore((state) => state.downloadInfo);
  const iLovePdfDownloadInfo = useCustomPdfToolStore((state) => state.iLovePdfDownloadInfo);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleAdobeDownload = async () => {
    try {
      if (!downloadInfo.processedFileUrl) {
        throw new Error('No download link available');
      }

      // Fetch the file first
      const response = await fetch(downloadInfo.processedFileUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `pdfmaking_converted_${downloadInfo.processedFileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(blobUrl);

      toast.success('Download completed successfully!');
    } catch (error) {
      console.error('Adobe download failed:', error);
      toast.error('Download failed. Please try again.');
      throw error; // Re-throw to be handled by main handler
    }
  };

  const handleCustomDownload = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${processedFileName}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = processedFileName || `pdfmaking_${new Date().toISOString()}.pdf`;
      link.click();

      // Clean up
      link.remove();
      URL.revokeObjectURL(blobUrl);

      toast.success('Download completed successfully!');
    } catch (error) {
      console.error('Custom download failed:', error);
      toast.error('Download failed. Please try again.');
      throw error; // Re-throw to be handled by main handler
    }
  };

  const handleIlovepdfDownload = async () => {
    const { task, server } = iLovePdfDownloadInfo;

    try {
      const res = await fetch('/api/ilovepdf/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, server }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to download');
      }

      const arrayBuffer = await res.arrayBuffer();
      const fileBlob = new Blob([arrayBuffer]);
      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const filename =
        iLovePdfDownloadInfo.output_filenumber > 1
          ? `pdfmaking_${fileNameAddOn}.zip`
          : `pdfmaking_${iLovePdfDownloadInfo.download_filename}`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Download completed successfully!');
    } catch (err) {
      console.error('[Download Error]', err);
      toast.error('Failed to download the file. Please try again.');
    }
  };

  const handleApryseDownload = async () => {
    try {
      console.log('downloadInfodownloadInfo', downloadInfo);

      // const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${processedFileName}`;
      // const response = await fetch(url);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const blob = await downloadInfo.processedFileUrl.blob();

      let blob: string;
      if (typeof downloadInfo.processedFileUrl === 'string') {
        // Already a URL string
        blob = downloadInfo.processedFileUrl;
      } else {
        // It's a Blob
        blob = URL.createObjectURL(downloadInfo.processedFileUrl);
      }

      const blobUrl = blob;
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadInfo?.processedFileName || `edit-pdf-${new Date().toISOString()}.pdf`;
      link.click();

      // Clean up
      link.remove();
      URL.revokeObjectURL(blobUrl);

      toast.success('Download completed successfully!');
    } catch (error) {
      console.error('Custom download failed:', error);
      toast.error('Download failed. Please try again.');
      throw error; // Re-throw to be handled by main handler
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      if (apiType === 'adobe') {
        await handleAdobeDownload();
      } else if (apiType === 'ilovepdf') {
        await handleIlovepdfDownload();
      } else if (apiType === 'apryse') {
        await handleApryseDownload();
      } else {
        await handleCustomDownload();
      }
    } catch (error) {
      console.error('Download process failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBackClick = () => {
    // Reload the page to go back to upload screen
    window.location.reload();
  };

  return (
    <MyContainer>
      {/* Back Button */}
      <div className='mb-5 pt-[40px] lg:pt-[80px]'>
        <button
          type='button'
          onClick={handleBackClick}
          className='text-brand-slate-600 hover:text-brand-primary flex cursor-pointer items-center gap-2 transition-colors'
        >
          <ArrowLeft size={16} className='h-auto w-auto' />
          <span className='text-base lg:text-lg/[27px]'>Back</span>
        </button>
      </div>

      <h1 className='mb-5 text-center text-2xl font-semibold lg:text-3xl xl:text-4xl/[48px] xl:tracking-[-0.75px]'>
        {pageHeading}
      </h1>

      <button
        type='button'
        className='shadow-custom-3d-md hover:bg-brand-primary-dark bg-brand-primary mx-auto mb-[50px] flex cursor-pointer items-center gap-2 rounded-full border border-black p-4 text-base font-bold text-white transition-colors sm:gap-3 md:text-lg lg:mb-[76px] lg:p-[22px] lg:text-[20px]/[17.92px]'
        disabled={isDownloading}
        onClick={handleDownload}
      >
        {isDownloading ? (
          <>
            <span>Preparing Download...</span>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
          </>
        ) : (
          <>
            {buttonLabel}
            {/* {`Download ${iLovePdfDownloadInfo.output_filenumber > 1 ? `${fileNameAddOn} ZIP` : `${fileNameAddOn} PDF`}`} */}
            <Image
              src='/images/pdf-tools/white-download-icon.svg'
              alt='White Download Icon'
              width={15}
              height={15}
              className='h-auto w-auto'
            />
          </>
        )}
      </button>

      <div className='bg-brand-slate-50 mb-[40px] rounded-[20px] p-[40px] lg:mb-[80px] lg:p-[50px]'>
        <h2 className='font-inter text-brand-slate-600 mb-[40px] text-lg font-bold lg:text-[20px]/[28.8px]'>
          Continue to....
        </h2>

        <div className='mb-10 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 md:gap-10'>
          {DOWNLOAD_PAGE_TOOLS.map((tool) => (
            <a key={tool.title} href={tool.href} className='group flex items-center gap-2.5'>
              <div className='bg-brand-primary flex h-[40px] w-[40px] items-center justify-center rounded-full'>
                <div className='relative h-[22px] w-[25px]'>
                  <Image src={tool.iconPath} alt={`${tool.title} Icon`} fill className='object-contain' />
                </div>
              </div>
              <span className='group-hover:text-brand-primary text-base lg:text-lg/[27px]'>{tool.title}</span>
            </a>
          ))}
        </div>

        <div className='text-center'>
          <a href='/#pdf-tools' className='text-brand-slate-600 hover:text-brand-primary text-lg/[27px] underline'>
            See more
          </a>
        </div>
      </div>
    </MyContainer>
  );
};

export default CustomDownloadScreen;
