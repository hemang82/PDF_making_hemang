'use client';

import { Globe, Loader2, X } from 'lucide-react';
import { type JSX, useState } from 'react';
import { toast } from 'sonner';

import DownloadScreen from '@/components/common/DownloadScreen';
import MyContainer from '@/components/common/MyContainer';
import PageSection from '@/components/common/PageSection';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';

const tool = 'htmlpdf';
const toolName = 'HTML to PDF';

const HtmlToPdfClient = (): JSX.Element => {
  const screenType = useCustomPdfToolStore((state) => state.screenType);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const setILovePdfDownloadInfo = useCustomPdfToolStore((state) => state.setILovePdfDownloadInfo);

  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Add this function to preprocess URLs
  const preprocessUrl = (inputUrl: string): string => {
    let processedUrl = inputUrl.trim();

    // If URL doesn't start with http:// or https://, add https://www.
    if (!processedUrl.match(/^https?:\/\//i)) {
      processedUrl = `https://www.${processedUrl}`;
    }

    return processedUrl;
  };

  // Updated validateUrl function
  // const validateUrl = (url: string): boolean => {
  //   try {
  //     new URL(url);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // };

  // Updated handleSubmit function
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Preprocess the URL to add https://www. if needed
    const processedUrl = preprocessUrl(url);

    // if (!validateUrl(processedUrl)) {
    //   toast.error('Please enter a valid URL');
    //   return;
    // }

    setIsProcessing(true);
    setShowModal(false);
    setUrl('');

    try {
      // Step 1: Start the task
      const startResponse = await fetch(`/api/ilovepdf/start?tool=${tool}`);
      if (!startResponse.ok) throw new Error('Failed to start task');

      const startData = await startResponse.json();
      const { task, server } = startData;

      // Step 2: Upload the URL as cloud file (use processedUrl instead of url)
      const uploadFormData = new FormData();
      uploadFormData.append('task', task);
      uploadFormData.append('server', server);
      uploadFormData.append('cloud_file', processedUrl); // Use the processed URL

      const uploadResponse = await fetch('/api/ilovepdf/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload URL');

      const uploadData = await uploadResponse.json();
      const { server_filename } = uploadData;

      // Step 3: Process the task
      const filePayload = [
        {
          server_filename,
          filename: `html_to_pdf_converted_PdfMaking`,
        },
      ];

      const processResponse = await fetch('/api/ilovepdf/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server,
          task,
          tool: 'htmlpdf',
          files: filePayload,
        }),
      });

      const data = await processResponse.json();

      if (!processResponse.ok) throw new Error('Failed to process PDF');

      setILovePdfDownloadInfo({
        ...data,
        task,
        server,
      });
      setScreenType('download');
    } catch (error) {
      console.error(`${toolName} error:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${toolName} PDFs. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className='from-brand-primary-50 to-brand-primary-100 flex h-[calc(100vh-142px)] items-center justify-center bg-gradient-to-br p-4'>
        <div className='w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl'>
          <div className='mb-6'>
            <div className='bg-brand-primary-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
              <Loader2 className='text-brand-primary h-8 w-8 animate-spin' />
            </div>
            <h2 className='mb-2 text-2xl font-bold text-gray-800'>Processing...</h2>
            <p className='text-gray-600'>Converting your HTML page to PDF</p>
          </div>

          <div className='space-y-3 text-left'>
            <div className='flex items-center space-x-3'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span className='text-sm text-gray-700'>Starting conversion task</span>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span className='text-sm text-gray-700'>Uploading URL</span>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='bg-brand-primary h-2 w-2 animate-pulse rounded-full'></div>
              <span className='text-sm text-gray-700'>Processing PDF</span>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='h-2 w-2 rounded-full bg-gray-300'></div>
              <span className='text-sm text-gray-500'>Preparing download</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const DOWNLOAD_SCREEN_PROPS = Object.freeze({
    pageHeading: 'HTML Has Been Converted!',
    buttonLabel: 'Download Converted PDF',
    apiType: 'ilovepdf',
    fileNameAddOn: 'converted',
  });

  const renderScreen = (): JSX.Element => {
    switch (screenType) {
      case 'download':
        return (
          <PageSection>
            <DownloadScreen {...DOWNLOAD_SCREEN_PROPS} />
          </PageSection>
        );

      default:
        return (
          <PageSection>
            <MyContainer className='pb-[25px] lg:pb-[50]'>
              <div className='mb-[50px] flex flex-col items-center pt-[100px]'>
                <div className='bg-brand-primary mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full'>
                  <Globe className='h-10 w-10 text-white' />
                </div>

                <h1 className='mb-[15px] text-center text-4xl/[48px] font-semibold tracking-[-0.75px]'>
                  HTML to PDF Converter
                </h1>
                <p className='font-inter text-brand-slate-600 text-center text-lg/[28.8px] font-normal'>
                  Convert any HTML webpage to PDF format quickly and easily.
                </p>
              </div>

              <div className='shadow-custom-md mb-8 rounded-[20px] p-8'>
                <h2 className='text-brand-slate-950 mb-6 text-2xl font-semibold'>How it works</h2>
                <div className='grid gap-6 md:grid-cols-3'>
                  <div className='text-center'>
                    <div className='bg-brand-primary-50 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                      <span className='text-brand-primary font-bold'>1</span>
                    </div>
                    <h3 className='text-brand-slate-950 mb-2 font-semibold'>Enter URL</h3>
                    <p className='font-inter text-brand-slate-600 mx-5 text-sm'>
                      Click the button below and enter the URL of the webpage you want to convert
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-brand-primary-50 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                      <span className='text-brand-primary font-bold'>2</span>
                    </div>
                    <h3 className='text-brand-slate-950 mb-2 font-semibold'>Processing</h3>
                    <p className='font-inter text-brand-slate-600 mx-5 text-sm'>
                      Our system will fetch the webpage and convert it to a PDF format
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-brand-primary-50 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                      <span className='text-brand-primary font-bold'>3</span>
                    </div>
                    <h3 className='text-brand-slate-950 mb-2 font-semibold'>Download</h3>
                    <p className='font-inter text-brand-slate-600 mx-5 text-sm'>
                      Download your converted PDF file instantly
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className='bg-brand-primary shadow-custom-3d-md hover:bg-brand-primary-dark mx-auto flex cursor-pointer items-center justify-center space-x-2 rounded-full border border-black px-8 py-4 text-lg font-medium text-white transition-colors duration-200'
              >
                <Globe className='h-6 w-6' />
                <span>Add HTML URL</span>
              </button>
            </MyContainer>

            {/* Modal */}
            {showModal && (
              <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                {/* Backdrop with opacity */}
                <div
                  className='absolute inset-0 bg-black opacity-70'
                  onClick={() => {
                    setShowModal(false);
                    setUrl('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowModal(false);
                      setUrl('');
                    }
                  }}
                  tabIndex={0}
                  role='button'
                  aria-label='Close modal'
                ></div>

                {/* Modal content - full opacity */}
                <div className='relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                  <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-gray-800'>Enter HTML URL</h2>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setUrl('');
                      }}
                      className='cursor-pointer text-gray-500 hover:text-gray-700'
                    >
                      <X className='h-6 w-6' />
                    </button>
                  </div>

                  <div>
                    <div className='mb-4'>
                      <label htmlFor='website-url' className='mb-2 block text-sm font-medium text-gray-700'>
                        Website URL
                      </label>
                      <input
                        type='url'
                        id='website-url'
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder='https://example.com'
                        className='focus:ring-brand-primary focus:border-brand-primary w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2'
                      />
                    </div>

                    <div className='flex space-x-3'>
                      <button
                        type='button'
                        onClick={() => {
                          setShowModal(false);
                          setUrl('');
                        }}
                        className='flex-1 cursor-pointer rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200'
                      >
                        Cancel
                      </button>
                      <button
                        type='button'
                        onClick={handleSubmit}
                        className='bg-brand-primary hover:bg-brand-primary-dark flex-1 cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors duration-200'
                      >
                        Convert to PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </PageSection>
        );
    }
  };

  return <PageSection>{renderScreen()}</PageSection>;
};

export default HtmlToPdfClient;
