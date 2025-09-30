'use client';

import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';

import ActionSidebar from '@/components/tool/ActionSidebar';
import AddFileSection from '@/components/tool/AddFileSection';
import EmptyPdfPlaceholder from '@/components/tool/EmptyPdfPlaceholder';
import ProcessingOverlay from '@/components/tool/ProcessingOverlay';
import SidebarToggleButton from '@/components/tool/SidebarToggleButton';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { useCustomPdfToolStore, type UploadedFile } from '@/store/useCustomPdfToolStore';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// OCR Language options
const OCR_LANGUAGES = [
  { value: 'eng', label: 'English' },
  { value: 'afr', label: 'Afrikaans' },
  { value: 'amh', label: 'Amharic' },
  { value: 'ara', label: 'Arabic' },
  { value: 'asm', label: 'Assamese' },
  { value: 'aze', label: 'Azerbaijani' },
  { value: 'aze_cyrl', label: 'Azerbaijani (Cyrillic)' },
  { value: 'bel', label: 'Belarusian' },
  { value: 'ben', label: 'Bengali' },
  { value: 'bod', label: 'Tibetan' },
  { value: 'bos', label: 'Bosnian' },
  { value: 'bre', label: 'Breton' },
  { value: 'bul', label: 'Bulgarian' },
  { value: 'cat', label: 'Catalan' },
  { value: 'ceb', label: 'Cebuano' },
  { value: 'ces', label: 'Czech' },
  { value: 'chi_sim', label: 'Chinese (Simplified)' },
  { value: 'chi_tra', label: 'Chinese (Traditional)' },
  { value: 'chr', label: 'Cherokee' },
  { value: 'cos', label: 'Corsican' },
  { value: 'cym', label: 'Welsh' },
  { value: 'dan', label: 'Danish' },
  { value: 'deu', label: 'German' },
  { value: 'deu_latf', label: 'German (Fraktur)' },
  { value: 'dzo', label: 'Dzongkha' },
  { value: 'ell', label: 'Greek' },
  { value: 'enm', label: 'Middle English' },
  { value: 'epo', label: 'Esperanto' },
  { value: 'equ', label: 'Math/Equation' },
  { value: 'est', label: 'Estonian' },
  { value: 'eus', label: 'Basque' },
  { value: 'fao', label: 'Faroese' },
  { value: 'fas', label: 'Persian' },
  { value: 'fil', label: 'Filipino' },
  { value: 'fin', label: 'Finnish' },
  { value: 'fra', label: 'French' },
  { value: 'frm', label: 'Middle French' },
  { value: 'fry', label: 'Frisian' },
  { value: 'gla', label: 'Scottish Gaelic' },
  { value: 'gle', label: 'Irish' },
  { value: 'glg', label: 'Galician' },
  { value: 'grc', label: 'Ancient Greek' },
  { value: 'guj', label: 'Gujarati' },
  { value: 'hat', label: 'Haitian Creole' },
  { value: 'heb', label: 'Hebrew' },
  { value: 'hin', label: 'Hindi' },
  { value: 'hrv', label: 'Croatian' },
  { value: 'hun', label: 'Hungarian' },
  { value: 'hye', label: 'Armenian' },
  { value: 'iku', label: 'Inuktitut' },
  { value: 'ind', label: 'Indonesian' },
  { value: 'isl', label: 'Icelandic' },
  { value: 'ita', label: 'Italian' },
  { value: 'ita_old', label: 'Italian (Old)' },
  { value: 'jav', label: 'Javanese' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'kan', label: 'Kannada' },
  { value: 'kat', label: 'Georgian' },
  { value: 'kat_old', label: 'Georgian (Old)' },
  { value: 'kaz', label: 'Kazakh' },
  { value: 'khm', label: 'Khmer' },
  { value: 'kir', label: 'Kyrgyz' },
  { value: 'kmr', label: 'Kurdish (Kurmanji)' },
  { value: 'kor', label: 'Korean' },
  { value: 'kor_vert', label: 'Korean (Vertical)' },
  { value: 'lao', label: 'Lao' },
  { value: 'lat', label: 'Latin' },
  { value: 'lav', label: 'Latvian' },
  { value: 'lit', label: 'Lithuanian' },
  { value: 'ltz', label: 'Luxembourgish' },
  { value: 'mal', label: 'Malayalam' },
  { value: 'mar', label: 'Marathi' },
  { value: 'mkd', label: 'Macedonian' },
  { value: 'mlt', label: 'Maltese' },
  { value: 'mon', label: 'Mongolian' },
  { value: 'mri', label: 'Maori' },
  { value: 'msa', label: 'Malay' },
  { value: 'mya', label: 'Myanmar' },
  { value: 'nep', label: 'Nepali' },
  { value: 'nld', label: 'Dutch' },
  { value: 'nor', label: 'Norwegian' },
  { value: 'oci', label: 'Occitan' },
  { value: 'ori', label: 'Oriya' },
  { value: 'pan', label: 'Punjabi' },
  { value: 'pol', label: 'Polish' },
  { value: 'por', label: 'Portuguese' },
  { value: 'pus', label: 'Pashto' },
  { value: 'que', label: 'Quechua' },
  { value: 'ron', label: 'Romanian' },
  { value: 'rus', label: 'Russian' },
  { value: 'san', label: 'Sanskrit' },
  { value: 'sin', label: 'Sinhala' },
  { value: 'slk', label: 'Slovak' },
  { value: 'slv', label: 'Slovenian' },
  { value: 'snd', label: 'Sindhi' },
  { value: 'spa', label: 'Spanish' },
  { value: 'spa_old', label: 'Spanish (Old)' },
  { value: 'sqi', label: 'Albanian' },
  { value: 'srp', label: 'Serbian' },
  { value: 'srp_latn', label: 'Serbian (Latin)' },
  { value: 'sun', label: 'Sundanese' },
  { value: 'swa', label: 'Swahili' },
  { value: 'swe', label: 'Swedish' },
  { value: 'syr', label: 'Syriac' },
  { value: 'tam', label: 'Tamil' },
  { value: 'tat', label: 'Tatar' },
  { value: 'tel', label: 'Telugu' },
  { value: 'tgk', label: 'Tajik' },
  { value: 'tgl', label: 'Tagalog' },
  { value: 'tha', label: 'Thai' },
  { value: 'tir', label: 'Tigrinya' },
  { value: 'ton', label: 'Tonga' },
  { value: 'tur', label: 'Turkish' },
  { value: 'uig', label: 'Uighur' },
  { value: 'ukr', label: 'Ukrainian' },
  { value: 'urd', label: 'Urdu' },
  { value: 'uzb', label: 'Uzbek' },
  { value: 'uzb_cyrl', label: 'Uzbek (Cyrillic)' },
  { value: 'vie', label: 'Vietnamese' },
  { value: 'yid', label: 'Yiddish' },
  { value: 'yor', label: 'Yoruba' },
];

// PDF Item Component
interface PdfItemProps {
  file: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  isDragging?: boolean;
}

const PdfItem = ({ file, index, onRemove, onRotate }: PdfItemProps) => {
  const removeAndRotateIconBtnClass =
    'bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full opacity-100 transition-all duration-200 group-hover:opacity-100 hover:scale-110 lg:opacity-0';

  return (
    <div className='group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] items-center justify-center rounded-md px-[43px] py-[39px] hover:border'>
      {/* Remove & Rotate Button */}
      <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0'>
        {/* Remove Button */}
        <button
          className={removeAndRotateIconBtnClass}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          aria-label='Remove file'
        >
          <Image
            src='/images/pdf-tools/white-close-icon.svg'
            alt='Close Icon'
            width={16}
            height={16}
            className='h-auto w-auto'
          />
        </button>

        {/* Rotate Button */}
        <button
          className={removeAndRotateIconBtnClass}
          onClick={(e) => {
            e.stopPropagation();
            onRotate(file.id);
          }}
          aria-label='Rotate file'
        >
          <Image
            src='/images/pdf-tools/white-rotate-icon.svg'
            alt='Rotate Icon'
            width={16}
            height={16}
            className='h-auto w-auto'
            style={{ transform: `rotate(${file.rotation || 0}deg)` }}
          />
        </button>
      </div>

      {/* File Number Badge */}
      <div className='bg-brand-primary absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'>
        {index + 1}
      </div>

      {/* File Name Badge */}
      <div className='bg-brand-primary absolute right-3 bottom-2 left-3 z-10 flex h-6 items-center justify-center rounded-[5px] text-[10px] font-bold text-white'>
        {file.name.length > 18 ? `${file.name.substring(0, 18)}...` : file.name}
      </div>

      {/* PDF Thumbnail */}
      <div className='transition-all' style={{ transform: `rotate(${file.rotation || 0}deg)` }}>
        <div className='relative flex items-center justify-center overflow-hidden'>
          <Document file={file.previewFileUrl} className='flex items-center justify-center'>
            <Page
              pageNumber={1}
              width={80.5}
              height={113.86}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className='shadow-sm'
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

interface PreviewScreenProps {
  heading: string;
  buttonLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
  fileNameAddOn: string;
  tool: string;
  toolName: string;
}

const PreviewScreen = ({
  heading,
  buttonLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
  fileNameAddOn,
  tool,
  toolName,
}: PreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const rotateUploadedFile = useCustomPdfToolStore((state) => state.rotateUploadedFile);
  const updateFileData = useCustomPdfToolStore((state) => state.updateFileData);
  const setILovePdfDownloadInfo = useCustomPdfToolStore((state) => state.setILovePdfDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['eng']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Custom hook to handle file upload logic
  const { onDrop } = useFileUploadHandler({
    isCheckPdfPasswordProtected,
    filesLimit,
    maxFileSizePerTaskInBytes,
    accept,
  });

  // File upload dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Combine both accepted and rejected files for our custom validation
      const allFiles = [...acceptedFiles, ...rejectedFiles.map((rejection) => rejection.file)];

      // Call our custom handler with all files (let our validation handle filtering)
      onDrop(allFiles);
    },
    accept,
    multiple,
    noClick: true,
    noKeyboard: true,
  });

  // Responsive Sidebar Toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLanguageSelect = (langValue: string) => {
    if (selectedLanguages.includes(langValue)) {
      setSelectedLanguages(selectedLanguages.filter((lang) => lang !== langValue));
    } else if (selectedLanguages.length < 3) {
      setSelectedLanguages([...selectedLanguages, langValue]);
    } else {
      toast.info('Maximum 3 languages can be selected');
    }
  };

  const getSelectedLanguagesText = () => {
    if (selectedLanguages.length === 0) return 'Select languages';
    return selectedLanguages.map((lang) => OCR_LANGUAGES.find((l) => l.value === lang)?.label || lang).join(', ');
  };

  const initializeTask = async () => {
    try {
      const response = await fetch(`/api/ilovepdf/start?tool=${tool}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} - Initialize Task Error]:`, errorData?.error);
        toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
        return;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Page InitializeTask Error]:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
    }
  };

  const uploadTask = async (task: string, server: string) => {
    try {
      const uploadPromises = uploadedFiles.map(async (fileItem) => {
        const response = await fetch('/api/ilovepdf/upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData();
            formData.append('file', fileItem.file);
            formData.append('task', task);
            formData.append('server', server);
            return formData;
          })(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`[${toolName} Page InitializeTask Error]:`, errorData?.error);
          toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
          throw new Error('Upload failed');
        }

        const data = await response.json();

        // Update state
        updateFileData(fileItem.id, {
          server_filename: data.server_filename,
        });
      });

      // Wait for all uploads and return the updated files
      await Promise.all(uploadPromises);
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Upload files error:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
      throw error;
    }
  };

  const processTask = async (task: string, server: string) => {
    const currentFiles = useCustomPdfToolStore.getState().uploadedFiles;

    const filePayload = currentFiles.map((f) => ({
      server_filename: f.server_filename,
      filename: `pdfmaking_${fileNameAddOn}_${f.name}`,
      rotate: f.rotation,
    }));

    try {
      const response = await fetch('/api/ilovepdf/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server,
          task,
          tool,
          files: filePayload,
          ocr_languages: selectedLanguages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} Process error:`, errorData?.error);
        toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
        throw new Error('Process failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Process error:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
      throw error;
    }
  };

  // Handle process
  const handleProcess = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Initialize the task
      setProcessingMessage('Initializing task...');
      const taskData = await initializeTask();

      if (!taskData.task || !taskData.server) {
        throw new Error('Failed to initialize task');
      }

      // Step 2: Upload files
      setProcessingMessage('Uploading your files...');

      await uploadTask(taskData.task, taskData.server);

      // Step 3: Process files
      setProcessingMessage('Processing your files...');

      const processResult = await processTask(taskData.task, taskData.server);

      // Step 4: Handle successful processing
      if (processResult) {
        setProcessingMessage('Finalizing files...');
        setILovePdfDownloadInfo({
          ...processResult,
          task: taskData.task,
          server: taskData.server,
        });
        setScreenType('download');
      } else {
        throw new Error('Failed to process files');
      }
    } catch (error) {
      console.error(`${toolName} error:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${toolName} PDFs. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const btnDisabledCondition = uploadedFiles.length === 0 || isProcessing || selectedLanguages.length === 0;

  return (
    <>
      <div className='flex h-full'>
        {/* Left Side - PDF Preview with Drag & Drop */}
        <div
          {...getRootProps({
            className:
              'relative flex h-[calc(100vh-145px)] flex-1 justify-center overflow-auto px-[37.7px] pt-[50px] xl:pt-[100px]',
          })}
        >
          <input {...getInputProps()} aria-label='File input' />

          {/* Drag & Drop Overlay */}
          {isDragActive && (
            <div className='bg-brand-primary/20 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
              <div className='flex flex-col items-center'>
                {/* Upload Icon */}
                <div className='relative mb-4 h-[60px] w-[60px] xl:h-[80px] xl:w-[80px]'>
                  <Image src='/images/pdf-tools/cloud-download-icon.svg' alt='Upload Icon' fill />
                </div>

                {/* Drop Text */}
                <p className='font-inter text-brand-primary text-xl font-semibold xl:text-2xl'>Drop files here</p>
                <p className='font-inter text-brand-slate-600 mt-2 text-base font-normal xl:text-lg'>
                  Release to upload your files
                </p>
              </div>
            </div>
          )}

          {/* File Grid */}
          <div className='mb-[50px] h-fit w-full lg:mx-[75px]'>
            <div className='flex flex-col items-center justify-center gap-[11.37px] md:flex-row md:flex-wrap'>
              {uploadedFiles.map((file, index) => (
                <PdfItem
                  key={file.id}
                  file={file}
                  index={index}
                  onRemove={removeUploadedFile}
                  onRotate={rotateUploadedFile}
                />
              ))}
            </div>

            {uploadedFiles.length === 0 && <EmptyPdfPlaceholder />}
          </div>

          {/* Add File Section */}
          <AddFileSection fileCount={uploadedFiles.length} onUpload={open} isShowSortFilesButton={true} />
        </div>

        {/* Right Side - Action Sidebar */}
        <ActionSidebar
          heading={heading}
          buttonLabel={buttonLabel}
          isProcessing={isProcessing}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onProcess={handleProcess}
          canProcess={!btnDisabledCondition}
          fileCount={uploadedFiles.length}
        >
          <p className='font-inter text-brand-slate-600 rounded-[10px] bg-white p-[21px] text-[16px]/[23px] font-normal'>
            Extract text from scanned PDFs and images using OCR technology. Convert your documents to searchable and
            editable text.
          </p>

          {/* OCR Language Selection */}
          <div className='my-8 w-full'>
            <h2 className='mb-4 text-xl font-bold text-white'>OCR Languages</h2>
            <div className='relative'>
              <button
                type='button'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='focus:border-brand-primary w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:border-gray-300 focus:outline-none'
              >
                <div className='flex items-center justify-between'>
                  <span className='truncate text-gray-700'>{getSelectedLanguagesText()}</span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>
              </button>

              {isDropdownOpen && (
                <div className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg'>
                  <div className='border-b px-3 py-2 text-sm text-gray-500'>Select up to 3 languages</div>
                  {OCR_LANGUAGES.map((language) => (
                    <div
                      key={language.value}
                      role='button'
                      tabIndex={0}
                      onClick={() => handleLanguageSelect(language.value)}
                      className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 ${
                        selectedLanguages.includes(language.value) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleLanguageSelect(language.value);
                        }
                      }}
                    >
                      <span>{language.label}</span>
                      {selectedLanguages.includes(language.value) && (
                        <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Languages Display */}
            {selectedLanguages.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {selectedLanguages.map((lang) => {
                  const langLabel = OCR_LANGUAGES.find((l) => l.value === lang)?.label || lang;
                  return (
                    <span
                      key={lang}
                      className='inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-gray-700'
                    >
                      {langLabel}
                      <button
                        onClick={() => handleLanguageSelect(lang)}
                        className='ml-1 cursor-pointer rounded-full border border-red-500 px-1 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-700'
                      >
                        x
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </ActionSidebar>
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay isVisible={isProcessing} message={processingMessage} />

      {/* Mobile Sidebar Toggle Button */}
      <SidebarToggleButton
        isSidebarOpen={isSidebarOpen}
        onToggle={() => {
          if (uploadedFiles.length === 0) {
            toast.error('Please upload at least one PDF file to proceed.');
            return;
          }
          setIsSidebarOpen(!isSidebarOpen);
        }}
      />
    </>
  );
};

export default PreviewScreen;
