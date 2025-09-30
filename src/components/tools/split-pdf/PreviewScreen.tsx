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

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Types
interface SplitPreviewScreenProps {
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

type SplitMode = 'range' | 'pages';
type RangeMode = 'custom' | 'fixed';

interface PageRange {
  id: string;
  from: number;
  to: number;
}

// PDF Page Component
interface PdfPageProps {
  file: UploadedFile;
  pageNumber: number;
  isSelected?: boolean;
  onToggle?: (pageNumber: number) => void;
  showCheckbox?: boolean;
  rangeLabel?: string;
}

const PdfPage = ({
  file,
  pageNumber,
  isSelected = false,
  onToggle,
  showCheckbox = false,
  rangeLabel,
}: PdfPageProps) => {
  const handleClick = () => showCheckbox && onToggle?.(pageNumber);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showCheckbox && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onToggle?.(pageNumber);
    }
  };

  return (
    <div className='relative'>
      <div
        className={`group hover:border-brand-primary bg-brand-slate-50 relative flex items-center justify-center rounded-md p-4 hover:border ${
          isSelected ? 'border-brand-primary border-2' : 'border border-gray-200'
        } ${showCheckbox ? 'cursor-pointer' : ''} bg-brand-slate-50`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={showCheckbox ? 0 : -1}
        role={showCheckbox ? 'button' : undefined}
        aria-pressed={showCheckbox ? isSelected : undefined}
      >
        {showCheckbox && (
          <div className='absolute top-2 left-2 z-10'>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
              }`}
            >
              {isSelected && (
                <svg className='h-3 w-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Page Number Badge */}
        <div className='bg-brand-primary absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'>
          {pageNumber}
        </div>

        {/* Range Label */}
        {rangeLabel && (
          <div className='absolute top-2 left-2 z-10 rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white'>
            {rangeLabel}
          </div>
        )}

        {/* PDF Thumbnail */}
        <div className='relative flex items-center justify-center overflow-hidden'>
          <Document file={file.previewFileUrl} className='flex items-center justify-center'>
            <Page
              pageNumber={pageNumber}
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

// Range Group Component
interface RangeGroupProps {
  rangeNumber: number;
  pages: number[];
  file: UploadedFile;
}

const RangeGroup = ({ rangeNumber, pages, file }: RangeGroupProps) => {
  const startPage = pages[0];
  const endPage = pages[pages.length - 1];
  const hasEllipsis = pages.length > 1;

  return (
    <div className='rounded-lg border bg-white p-4'>
      <h3 className='mb-3 text-sm font-semibold text-gray-700'>Range {rangeNumber}</h3>
      <div className='flex justify-between'>
        {/* Show first page */}
        <PdfPage file={file} pageNumber={startPage} />

        {/* Show ellipsis if there are pages in between */}
        {hasEllipsis && (
          <div className='flex w-8 items-center justify-center text-2xl font-bold text-gray-400'>...</div>
        )}

        {/* Show last page if different from first */}
        {endPage !== startPage && <PdfPage file={file} pageNumber={endPage} />}
      </div>
    </div>
  );
};

// Range Mode Component
interface RangeModeProps {
  numPages: number;
  rangeMode: RangeMode;
  customRanges: PageRange[];
  fixedRangeCount: number;
  mergeAllRanges: boolean;
  onRangeModeChange: (mode: RangeMode) => void;
  onCustomRangeChange: (ranges: PageRange[]) => void;
  onFixedRangeCountChange: (count: number) => void;
  onMergeAllRangesChange: (merge: boolean) => void;
}

const RangeMode = ({
  numPages,
  rangeMode,
  customRanges,
  fixedRangeCount,
  mergeAllRanges,
  onRangeModeChange,
  onCustomRangeChange,
  onFixedRangeCountChange,
  onMergeAllRangesChange,
}: RangeModeProps) => {
  // Separate state for input display values
  const [inputValues, setInputValues] = useState<Record<string, { from: string; to: string }>>({});

  const addRange = () => {
    const newRange: PageRange = {
      id: Date.now().toString(),
      from: 1,
      to: Math.min(3, numPages),
    };
    onCustomRangeChange([...customRanges, newRange]);

    // Initialize input values for the new range
    setInputValues((prev) => ({
      ...prev,
      [newRange.id]: { from: '1', to: Math.min(3, numPages).toString() },
    }));
  };

  // Initialize input values when component mounts or ranges change
  useEffect(() => {
    const newInputValues: Record<string, { from: string; to: string }> = {};

    customRanges.forEach((range) => {
      if (!inputValues[range.id]) {
        newInputValues[range.id] = {
          from: range.from.toString(),
          to: range.to.toString(),
        };
      }
    });

    if (Object.keys(newInputValues).length > 0) {
      setInputValues((prev) => ({ ...prev, ...newInputValues }));
    }
  }, [customRanges, inputValues]); // Only run when ranges are added/removed

  useEffect(() => {
    customRanges.forEach((range) => {
      if (inputValues[range.id]) {
        inputValues[range.id] = {
          from: range.from.toString(),
          to: numPages.toString(),
        };
      }
    });
  }, [numPages]);

  // Handle input change - only update display value
  const handleInputChange = (id: string, field: 'from' | 'to', value: string) => {
    let finalValue: number;

    if (value === '' || isNaN(parseInt(value)) || parseInt(value) < 1) {
      setInputValues((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    } else {
      finalValue = Math.min(parseInt(value), numPages);
      // Update display value to show the clamped value
      setInputValues((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: finalValue,
        },
      }));

      // Update actual range
      const updatedRanges = customRanges.map((range) => (range.id === id ? { ...range, [field]: finalValue } : range));
      onCustomRangeChange(updatedRanges);
    }
  };

  // Handle blur - validate and update actual range
  const handleInputBlur = (id: string, field: 'from' | 'to', value: string) => {
    let finalValue: number;

    if (value === '' || isNaN(parseInt(value)) || parseInt(value) < 1) {
      finalValue = 1;
      // Update display value to show 1
      setInputValues((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: finalValue,
        },
      }));
    } else {
      finalValue = Math.min(parseInt(value), numPages);

      // Update display value to show the clamped value
      setInputValues((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: finalValue,
        },
      }));
    }

    // Update actual range
    const updatedRanges = customRanges.map((range) => (range.id === id ? { ...range, [field]: finalValue } : range));
    onCustomRangeChange(updatedRanges);
  };

  const removeRange = (id: string) => {
    onCustomRangeChange(customRanges.filter((range) => range.id !== id));

    // Clean up input values
    setInputValues((prev) => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const [fixedCount, setFixedCount] = useState('');

  useEffect(() => {
    if (fixedCount === '') {
      setFixedCount(fixedRangeCount.toString());
    }
  }, []);

  const handleFixedRangeCount = (value: string) => {
    let finalValue: number;

    if (value === '' || isNaN(parseInt(value)) || parseInt(value) < 1) {
      setFixedCount(value);
    } else {
      finalValue = Math.min(parseInt(value), numPages);
      setFixedCount(finalValue.toString());

      onFixedRangeCountChange(finalValue);
    }
  };

  const handleFixedRangeCountBlur = (value: string) => {
    let finalValue: number;

    if (value === '' || isNaN(parseInt(value)) || parseInt(value) < 1) {
      finalValue = 1;
      setFixedCount(finalValue.toString());
    } else {
      finalValue = Math.min(parseInt(value), numPages);
      setFixedCount(finalValue.toString());
    }

    onFixedRangeCountChange(finalValue);
  };

  return (
    <>
      <label htmlFor='range-mode-selector' className='mb-4 block text-sm font-medium text-white'>
        Range mode
      </label>
      <div className='mb-4 flex justify-between'>
        <button
          onClick={() => onRangeModeChange('custom')}
          className={`mx-1 flex-1 cursor-pointer rounded-full py-2 text-sm font-medium ${
            rangeMode === 'custom' ? 'bg-white text-[#51bcd0]' : 'border border-white bg-[#51bcd0] text-white'
          }`}
        >
          Custom ranges
        </button>
        <button
          onClick={() => onRangeModeChange('fixed')}
          className={`mx-1 flex-1 cursor-pointer rounded-full py-2 text-sm font-medium ${
            rangeMode === 'fixed' ? 'bg-white text-[#51bcd0]' : 'border border-white bg-[#51bcd0] text-white'
          }`}
        >
          Fixed ranges
        </button>
      </div>

      {rangeMode === 'custom' && (
        <div className='mb-4 space-y-4'>
          {customRanges.map((range, index) => (
            <div key={range.id}>
              <label className='mb-2 block text-sm font-medium text-white'>Range {index + 1}</label>
              <div className='flex items-center justify-between gap-2 rounded-full px-4 py-2 text-white'>
                <span className='text-sm font-medium'>From Page</span>
                <input
                  type='number'
                  min='1'
                  max={numPages}
                  value={inputValues[range.id]?.from ?? range.from}
                  onChange={(e) => handleInputChange(range.id, 'from', e.target.value)}
                  onBlur={(e) => handleInputBlur(range.id, 'from', e.target.value)}
                  className='focus:bg-brand-primary-dark focus:border-brand w-16 rounded-full border px-2 py-2 text-center text-sm focus:outline-none'
                />
                <span className='text-sm font-medium'>To</span>
                <input
                  type='number'
                  min='1'
                  max={numPages}
                  value={inputValues[range.id]?.to ?? range.to}
                  onChange={(e) => handleInputChange(range.id, 'to', e.target.value)}
                  onBlur={(e) => handleInputBlur(range.id, 'to', e.target.value)}
                  className='focus:bg-brand-primary-dark focus:border-brand w-16 rounded-full border px-2 py-2 text-center text-sm focus:outline-none'
                />

                {customRanges.length > 1 && (
                  <button
                    onClick={() => removeRange(range.id)}
                    className='cursor-pointer rounded-full border border-red-500 px-2 py-1 text-xs font-bold text-red-500 hover:text-red-400'
                  >
                    x
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addRange}
            className='mx-auto flex w-45 justify-center rounded-full bg-white py-2 font-semibold text-[#51bcd0] hover:bg-gray-100'
          >
            + Add Range
          </button>

          <div className='mt-4 mb-6 flex items-center gap-2 text-white'>
            <input
              id='merge-all'
              type='checkbox'
              checked={mergeAllRanges}
              onChange={(e) => onMergeAllRangesChange(e.target.checked)}
              className='h-4 w-4'
            />
            <label className='text-sm' htmlFor='merge-all'>
              Merge All Ranges In One PDF File.
            </label>
          </div>
        </div>
      )}

      {rangeMode === 'fixed' && (
        <div className='mb-4'>
          <div className='mb-2 flex items-center justify-between rounded-full px-4 py-2 text-white'>
            <label className='text-sm font-medium' htmlFor='split-into-page-ranges'>
              Pages per range
            </label>
            <input
              id='split-into-page-ranges'
              type='number'
              min='1'
              max={numPages}
              value={fixedCount}
              onChange={(e) => handleFixedRangeCount(e.target.value)}
              onBlur={(e) => handleFixedRangeCountBlur(e.target.value)}
              className='focus:bg-brand-primary-dark focus:border-brand w-16 rounded-full border px-2 py-2 text-center text-sm focus:outline-none'
            />
          </div>
          <div className='text-center text-xs text-white'>
            {fixedRangeCount} pages per file, {Math.ceil(numPages / fixedRangeCount)} files will be created.
          </div>
          <p className='text-brand-slate-600 font-inter my-4 rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
            This PDF will be split into files of {fixedRangeCount} pages. {Math.ceil(numPages / fixedRangeCount)} PDFs
            will be created.
          </p>
        </div>
      )}
    </>
  );
};

// Pages Mode Component
interface PagesModeProps {
  numPages: number;
  selectedPages: number[];
  pageInput: string;
  mergeAllRanges: boolean;
  onPageInputChange: (value: string) => void;
  onMergeAllRangesChange: (merge: boolean) => void;
  onExtractAllPages: () => void;
  onSelectPages: () => void;
}

const PagesMode = ({
  numPages,
  selectedPages,
  pageInput,
  mergeAllRanges,
  onPageInputChange,
  onMergeAllRangesChange,
  onExtractAllPages,
  onSelectPages,
}: PagesModeProps) => {
  const isExtractAll = selectedPages.length === numPages;

  return (
    <div className='space-y-6'>
      <p className='text-base font-semibold text-white'>Extract mode</p>

      <div className='flex gap-3'>
        <button
          onClick={onExtractAllPages}
          className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
            isExtractAll
              ? 'bg-white text-[#00B5D7]'
              : 'border border-white text-white hover:bg-white hover:text-[#00B5D7]'
          }`}
        >
          Extract all pages
        </button>
        <button
          onClick={onSelectPages}
          className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
            !isExtractAll
              ? 'bg-white text-[#00B5D7]'
              : 'border border-white text-white hover:bg-white hover:text-[#00B5D7]'
          }`}
        >
          Select pages
        </button>
      </div>

      {!isExtractAll && (
        <div className='space-y-3'>
          <div className='mb-2 flex items-center justify-between rounded-full px-4 py-2 text-white'>
            <label htmlFor='pageInput' className='text-sm font-medium'>
              Pages to extract
            </label>
            <input
              id='pageInput'
              type='text'
              placeholder='example: 1,5-8'
              value={pageInput}
              onChange={(e) => onPageInputChange(e.target.value)}
              className='focus:bg-brand-primary-dark w-30 rounded-full border px-2 py-2 text-center text-sm focus:outline-none'
            />
          </div>

          <label className='flex items-center gap-2 text-sm text-white'>
            <input
              type='checkbox'
              checked={mergeAllRanges}
              onChange={(e) => onMergeAllRangesChange(e.target.checked)}
              className='h-4 w-4'
            />
            Merge extracted pages into one PDF
          </label>
        </div>
      )}

      {!mergeAllRanges && !isExtractAll && (
        <div className='rounded-lg bg-white p-4 text-center text-sm text-gray-700 shadow-md'>
          Selected pages will be converted into separate PDF files. <strong>{selectedPages.length} PDF</strong> will be
          created.
        </div>
      )}

      {isExtractAll && (
        <div className='rounded-lg bg-white p-4 text-center text-sm text-gray-700 shadow-md'>
          All {selectedPages.length} pages selected.
        </div>
      )}
    </div>
  );
};

// Mode Selector Component
interface ModeSelectorProps {
  splitMode: SplitMode;
  onSplitModeChange: (mode: SplitMode) => void;
}

const ModeSelector = ({ splitMode, onSplitModeChange }: ModeSelectorProps) => {
  const iconMap: Record<SplitMode, { selected: string; default: string }> = {
    range: {
      selected: '/images/pdf-tools/range-filled.svg',
      default: '/images/pdf-tools/range-default.svg',
    },
    pages: {
      selected: '/images/pdf-tools/pages-filled.svg',
      default: '/images/pdf-tools/pages-default.svg',
    },
    // size: {
    //   selected: '/images/pdf-tools/size-filled.svg',
    //   default: '/images/pdf-tools/size-default.svg',
    // },
  };

  return (
    <div className='mb-6 flex justify-center gap-8'>
      {(['range', 'pages'] as SplitMode[]).map((mode) => (
        <div className='flex flex-col items-center justify-center' key={mode}>
          <button
            onClick={() => onSplitModeChange(mode)}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-semibold ${
              splitMode === mode ? 'bg-white text-[#51bcd0]' : 'border-white text-white'
            }`}
          >
            <Image
              className='object-contain'
              src={splitMode === mode ? iconMap[mode].selected : iconMap[mode].default}
              alt={mode}
              width={25}
              height={25}
              aria-hidden='true'
            />
          </button>
          <span className='mt-2 text-sm font-medium text-white'>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
        </div>
      ))}
    </div>
  );
};

// Custom Hook for Split Logic
const useSplitLogic = (numPages: number) => {
  const [splitMode, setSplitMode] = useState<SplitMode>('range');
  const [rangeMode, setRangeMode] = useState<RangeMode>('custom');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [customRanges, setCustomRanges] = useState<PageRange[]>([{ id: '1', from: 1, to: numPages }]);
  const [fixedRangeCount, setFixedRangeCount] = useState(1);
  const [mergeAllRanges, setMergeAllRanges] = useState(false);
  const [pageInput, setPageInput] = useState('');

  // Initialize selected pages when switching to pages mode
  useEffect(() => {
    if (splitMode === 'pages' && numPages) {
      setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
    }
  }, [splitMode, numPages]);

  // Update custom ranges when numPages changes
  useEffect(() => {
    if (numPages && customRanges.length === 1) {
      setCustomRanges([{ id: '1', from: 1, to: numPages }]);
    }
  }, [numPages, customRanges.length]);

  // Reset function to clear all state
  const resetSplitState = () => {
    setSplitMode('range');
    setRangeMode('custom');
    setSelectedPages([]);
    setCustomRanges([{ id: '1', from: 1, to: 1 }]);
    setFixedRangeCount(1);
    setMergeAllRanges(false);
    setPageInput('');
  };

  const handleSplitModeChange = (mode: SplitMode) => {
    setSplitMode(mode);
    if (mode === 'pages' && numPages) {
      setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
      setPageInput('');
    }
  };

  const handlePageToggle = (pageNumber: number) => {
    const newSelectedPages = selectedPages.includes(pageNumber)
      ? selectedPages.filter((p) => p !== pageNumber)
      : [...selectedPages, pageNumber];
    setSelectedPages(newSelectedPages);
    updatePageInput(newSelectedPages);
  };

  const updatePageInput = (pages: number[]) => {
    if (pages.length === 0) {
      setPageInput('');
      return;
    }
    const sortedPages = [...pages].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sortedPages[0];
    let end = sortedPages[0];

    for (let i = 1; i < sortedPages.length; i++) {
      if (sortedPages[i] === end + 1) {
        end = sortedPages[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sortedPages[i];
        end = sortedPages[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    setPageInput(ranges.join(','));
  };

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
    if (value.trim()) {
      const pages = parsePageInput(value);
      setSelectedPages(pages);
    } else {
      setSelectedPages([]);
    }
  };

  const parsePageInput = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= numPages && !pages.includes(i)) {
              pages.push(i);
            }
          }
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= numPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }
    return pages.sort((a, b) => a - b);
  };

  const handleExtractAllPages = () => {
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
    setPageInput('');
  };

  const handleSelectPages = () => {
    setSelectedPages([]);
    setPageInput('');
  };

  const generateFixedRanges = (): PageRange[] => {
    if (!numPages) return [];
    const ranges: PageRange[] = [];
    const pagesPerRange = fixedRangeCount;
    const totalRanges = Math.ceil(numPages / pagesPerRange); // Calculate how many ranges we'll have

    for (let i = 0; i < totalRanges; i++) {
      const from = i * pagesPerRange + 1;
      const to = Math.min((i + 1) * pagesPerRange, numPages);
      if (from <= numPages) {
        ranges.push({ id: `fixed-${i}`, from, to });
      }
    }
    return ranges;
  };

  const getCurrentRanges = (): PageRange[] => {
    if (splitMode !== 'range') return [];
    return rangeMode === 'custom' ? customRanges : generateFixedRanges();
  };

  const canProcess =
    numPages &&
    ((splitMode === 'range' && getCurrentRanges().length > 0) || (splitMode === 'pages' && selectedPages.length > 0));

  return {
    splitMode,
    rangeMode,
    selectedPages,
    customRanges,
    fixedRangeCount,
    mergeAllRanges,
    pageInput,
    canProcess,
    resetSplitState,
    handleSplitModeChange,
    handlePageToggle,
    handlePageInputChange,
    handleExtractAllPages,
    handleSelectPages,
    setRangeMode,
    setCustomRanges,
    setFixedRangeCount,
    setMergeAllRanges,
    getCurrentRanges,
  };
};

// Main Component
const SplitPreviewScreen = ({
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
}: SplitPreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const rotateUploadedFile = useCustomPdfToolStore((state) => state.rotateUploadedFile);
  const updateFileData = useCustomPdfToolStore((state) => state.updateFileData);
  const clearAllFiles = useCustomPdfToolStore((state) => state.clearAllFiles);
  const setILovePdfDownloadInfo = useCustomPdfToolStore((state) => state.setILovePdfDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [numPages, setNumPages] = useState<number>(0);

  const currentFile = uploadedFiles[0];

  const {
    splitMode,
    rangeMode,
    selectedPages,
    customRanges,
    fixedRangeCount,
    mergeAllRanges,
    pageInput,
    canProcess,
    resetSplitState,
    handleSplitModeChange,
    handlePageToggle,
    handlePageInputChange,
    handleExtractAllPages,
    handleSelectPages,
    setRangeMode,
    setCustomRanges,
    setFixedRangeCount,
    setMergeAllRanges,
    getCurrentRanges,
  } = useSplitLogic(numPages);

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

  const onDocumentLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
    setNumPages(pages);
  };

  // Responsive sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRemoveFile = () => {
    // Clear all uploaded files
    clearAllFiles();

    // Reset all split-related state using the hook's reset function
    resetSplitState();

    // Reset numPages in component state
    setNumPages(0);

    // Close sidebar on mobile if open
    setIsSidebarOpen(false);
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
          console.error(`[${toolName} Page Upload Error]:`, errorData?.error);
          toast.error(`Failed to upload file. Please refresh and try again.`);
          throw new Error('Upload failed');
        }

        const data = await response.json();

        // Update state
        updateFileData(fileItem.id, {
          server_filename: data.server_filename,
        });
      });

      // Wait for all uploads
      await Promise.all(uploadPromises);
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Upload files error:`, message);
      toast.error(`Failed to upload files. Please refresh and try again.`);
      throw error;
    }
  };

  const processTask = async (task: string, server: string) => {
    const currentFiles = useCustomPdfToolStore.getState().uploadedFiles;

    // Map UI state to iLovePDF API parameters
    const apiParams: any = {};

    if (splitMode === 'range') {
      const ranges = getCurrentRanges();

      if (rangeMode === 'custom') {
        // Custom ranges mode
        apiParams.split_mode = 'ranges';
        apiParams.ranges = ranges.map((range) => `${range.from}-${range.to}`).join(',');
        apiParams.merge_after = mergeAllRanges;
      } else if (rangeMode === 'fixed') {
        // Fixed range mode
        apiParams.split_mode = 'fixed_range';
        apiParams.fixed_range = fixedRangeCount;
        // merge_after doesn't apply to fixed_range mode according to docs
      }
    } else if (splitMode === 'pages') {
      if (selectedPages.length === numPages) {
        // Extract all pages - use fixed_range with 1 page per file
        apiParams.split_mode = 'fixed_range';
        apiParams.fixed_range = 1;
      } else {
        // Extract specific pages - use remove_pages (remove the pages NOT selected)
        const allPages = Array.from({ length: numPages }, (_, i) => i + 1);
        const pagesToRemove = allPages.filter((page) => !selectedPages.includes(page));
        // apiParams.split_mode = 'remove_pages';
        // apiParams.remove_pages = pagesToRemove.join(',');
        // apiParams.merge_after = mergeAllRanges;

        if (pagesToRemove.length > 0) {
          // Use ranges mode to handle selected pages and support merge_after
          apiParams.split_mode = 'ranges';

          // Convert selected pages to ranges format
          // List all pages individually (no range format)
          const sortedPages = [...selectedPages].sort((a, b) => a - b);
          apiParams.ranges = sortedPages.join(',');
          apiParams.merge_after = mergeAllRanges;
        } else {
          // All pages selected, use ranges instead
          apiParams.split_mode = 'ranges';
          apiParams.ranges = selectedPages.join(',');
          apiParams.merge_after = mergeAllRanges;
        }
      }
    }

    const filePayload = currentFiles.map((f) => ({
      server_filename: f.server_filename,
      filename: `pdfmaking_${fileNameAddOn}_${f.name}`,
      rotate: f.rotation || 0,
    }));

    console.log('🚀 ~ processTask ~ apiParams:', apiParams);

    try {
      const response = await fetch('/api/ilovepdf/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server,
          task,
          tool,
          files: filePayload,
          ...apiParams, // Spread the API parameters
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} Process error:`, errorData?.error);
        toast.error(`Failed to process ${toolName} task. Please refresh and try again.`);
        throw new Error('Process failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Process error:`, message);
      toast.error(`Failed to process files. Please refresh and try again.`);
      throw error;
    }
  };

  // Handle process (updated to use iLovePDF API pattern)
  const handleProcess = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Initialize the task
      setProcessingMessage('Initializing task...');
      const taskData = await initializeTask();

      if (!taskData?.task || !taskData.server) {
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
        toast.success('PDF split successfully!');
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

  const renderSplitContent = () => {
    if (!currentFile || !numPages) return null;

    if (splitMode === 'range') {
      const ranges = getCurrentRanges();

      return (
        <div className='flex flex-wrap justify-center gap-4'>
          {ranges.map((range, index) => {
            const pages = Array.from({ length: range.to - range.from + 1 }, (_, i) => range.from + i);
            return <RangeGroup key={range.id} rangeNumber={index + 1} pages={pages} file={currentFile} />;
          })}
        </div>
      );
    }

    if (splitMode === 'pages') {
      return (
        <div className='flex flex-col items-center justify-center gap-[11.37px] md:flex-row md:flex-wrap'>
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
            <PdfPage
              key={pageNumber}
              file={currentFile}
              pageNumber={pageNumber}
              isSelected={selectedPages.includes(pageNumber)}
              onToggle={handlePageToggle}
              showCheckbox={true}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  const btnDisabledCondition = uploadedFiles.length === 0 || isProcessing;

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
            {currentFile && (
              <div className='mb-4 flex flex-col items-center justify-between lg:flex-row'>
                <h3 className='text-lg font-semibold'>{currentFile.name}</h3>
                <button
                  onClick={handleRemoveFile}
                  className='cursor-pointer text-red-500 underline transition-transform hover:scale-105 hover:text-red-600'
                >
                  Remove All
                </button>
              </div>
            )}

            {currentFile && (
              <Document file={currentFile.previewFileUrl} onLoadSuccess={onDocumentLoadSuccess} className='hidden'>
                <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            )}

            {renderSplitContent()}

            {!currentFile && <EmptyPdfPlaceholder />}
          </div>

          {/* Add File Section */}
          {!currentFile && (
            <AddFileSection fileCount={uploadedFiles.length} onUpload={open} isShowSortFilesButton={false} />
          )}
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
          <div className='w-full'>
            <ModeSelector splitMode={splitMode} onSplitModeChange={handleSplitModeChange} />

            {splitMode === 'range' && (
              <RangeMode
                numPages={numPages}
                rangeMode={rangeMode}
                customRanges={customRanges}
                fixedRangeCount={fixedRangeCount}
                mergeAllRanges={mergeAllRanges}
                onRangeModeChange={setRangeMode}
                onCustomRangeChange={setCustomRanges}
                onFixedRangeCountChange={setFixedRangeCount}
                onMergeAllRangesChange={setMergeAllRanges}
              />
            )}

            {splitMode === 'pages' && (
              <PagesMode
                numPages={numPages}
                selectedPages={selectedPages}
                pageInput={pageInput}
                mergeAllRanges={mergeAllRanges}
                onPageInputChange={handlePageInputChange}
                onMergeAllRangesChange={setMergeAllRanges}
                onExtractAllPages={handleExtractAllPages}
                onSelectPages={handleSelectPages}
              />
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

export default SplitPreviewScreen;
