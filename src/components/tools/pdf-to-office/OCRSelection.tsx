import { type JSX } from 'react';
import { toast } from 'sonner';

import { CustomDropdown } from '@/components/tools/pdf-to-office/CustomDropdown';
import { OCR_LANGUAGES } from '@/constants/pdfTools';
import { type ConversionOptions } from '@/types/conversion';
import { PDFConversionService } from '@/utils/pdfConversion';

// OCR Selection Component
interface OCRSelectionProps {
  selectedOCRType: 'no-ocr' | 'ocr';
  onOCRTypeChange: (type: 'no-ocr' | 'ocr') => void;
  selectedOCRLang: string;
  onOCRLangChange: (lang: string) => void;
  isUserPremium: boolean;
  targetFormat: ConversionOptions['targetFormat'];
}

export const OCRSelection = ({
  selectedOCRType,
  onOCRTypeChange,
  selectedOCRLang,
  onOCRLangChange,
  isUserPremium,
  targetFormat,
}: OCRSelectionProps): JSX.Element => {
  const handleOCRClick = () => {
    if (!isUserPremium) {
      toast.error('Please upgrade to Premium to use OCR functionality');
      return;
    }
    onOCRTypeChange('ocr');
  };

  const formatName = PDFConversionService.getFormatDisplayName(targetFormat);

  return (
    <div className='space-y-4'>
      <h3 className='mb-4 text-lg font-semibold text-white'>Conversion Options</h3>

      {/* No OCR Option */}
      <div
        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
          selectedOCRType === 'no-ocr'
            ? 'border-brand-primary-dark bg-white'
            : 'border-white/20 bg-white/5 hover:border-white/40'
        }`}
        onClick={() => {
          onOCRTypeChange('no-ocr');
          onOCRLangChange('en-US');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOCRTypeChange('no-ocr');
          }
        }}
        tabIndex={0}
        role='button'
        aria-pressed={selectedOCRType === 'no-ocr'}
      >
        <div className='flex items-start gap-3'>
          <div className='flex items-center justify-center'>
            <div
              className={`mt-1 h-4 w-4 rounded-full border-2 ${
                selectedOCRType === 'no-ocr' ? 'border-brand-primary-dark bg-brand-primary-dark' : 'border-white/40'
              }`}
            >
              {selectedOCRType === 'no-ocr' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
            </div>
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span className={`font-semibold ${selectedOCRType === 'no-ocr' ? 'text-brand-primary' : 'text-white'}`}>
                NO OCR
              </span>
            </div>
            <p className={`mt-1 text-sm ${selectedOCRType === 'no-ocr' ? 'text-brand-primary/80' : 'text-white/80'}`}>
              Convert PDFs with selectable text into editable {formatName} files.
            </p>
          </div>
        </div>
      </div>

      {/* OCR Option */}
      <div
        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
          selectedOCRType === 'ocr'
            ? 'border-brand-primary-dark bg-white'
            : 'border-white/20 bg-white/5 hover:border-white/40'
        }`}
        onClick={handleOCRClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOCRClick();
          }
        }}
        tabIndex={0}
        role='button'
        aria-pressed={selectedOCRType === 'ocr'}
      >
        <div className='flex items-start gap-3'>
          <div className='flex items-center justify-center'>
            <div
              className={`mt-1 h-4 w-4 rounded-full border-2 ${
                selectedOCRType === 'ocr' ? 'border-brand-primary-dark bg-brand-primary-dark' : 'border-white/40'
              }`}
            >
              {selectedOCRType === 'ocr' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
            </div>
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span className={`font-semibold ${selectedOCRType === 'ocr' ? 'text-brand-primary' : 'text-white'}`}>
                OCR
              </span>
              <span className='rounded-full bg-yellow-500 px-2 py-1 text-xs text-white'>Premium</span>
            </div>
            <p className={`mt-1 text-sm ${selectedOCRType === 'ocr' ? 'text-brand-primary/80' : 'text-white/80'}`}>
              Convert scanned PDFs with non-selectable text into editable {formatName} files.
            </p>
          </div>
        </div>
      </div>

      {/* Language Selection - Only show when OCR is selected */}
      {selectedOCRType === 'ocr' && (
        <div className='mt-4 space-y-3'>
          <h4 className='text-sm font-medium text-white'>OCR Language</h4>
          <CustomDropdown
            value={selectedOCRLang}
            onChange={onOCRLangChange}
            options={OCR_LANGUAGES}
            placeholder='Select OCR Language'
          />
        </div>
      )}
    </div>
  );
};
