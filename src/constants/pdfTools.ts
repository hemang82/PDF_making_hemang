export interface BaseTool {
  title: string;
  href: string;
  iconPath: string;
}

export interface PdfTool extends BaseTool {
  description: string;
}

export const DOWNLOAD_PAGE_TOOLS: BaseTool[] = [
  { title: 'Compress PDF', href: '/tools/compress-pdf', iconPath: '/images/home/pdf-tools/compress.svg' },
  { title: 'Split PDF', href: '/tools/split-pdf', iconPath: '/images/home/pdf-tools/split.svg' },
  { title: 'Add Page numbers', href: '/tools/add-page-numbers', iconPath: '/images/home/pdf-tools/page-numbers.svg' },
  // { title: 'Watermark PDF', href: '/tools/watermark-pdf', iconPath: '/images/home/pdf-tools/watermark.svg' },
  { title: 'Remove Pages', href: '/tools/remove-pages', iconPath: '/images/home/pdf-tools/watermark.svg' },
  { title: 'Rotate PDF', href: '/tools/rotate-pdf', iconPath: '/images/home/pdf-tools/rotate.svg' },
  { title: 'Protect PDF', href: '/tools/protect-pdf', iconPath: '/images/home/pdf-tools/protect.svg' },
];

export const PDF_TOOLS: PdfTool[] = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple, various file formats into one single PDF.',
    href: '/tools/merge-pdf',
    iconPath: '/images/home/pdf-tools/merge.svg',
  },
  {
    title: 'Split PDF',
    description: 'Create new PDF documents from a page range.',
    href: '/tools/split-pdf',
    iconPath: '/images/home/pdf-tools/split.svg',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce the size of any PDF without affecting file quality.',
    href: '/tools/compress-pdf',
    iconPath: '/images/home/pdf-tools/compress.svg',
  },
  {
    title: 'PDF to Word',
    description: 'Convert your PDFs to Word files online in just a few clicks.',
    href: '/tools/pdf-to-word',
    iconPath: '/images/home/pdf-tools/pdf-to-word.svg',
  },
  {
    title: 'PDF to PowerPoint',
    description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
    href: '/tools/pdf-to-powerpoint',
    iconPath: '/images/home/pdf-tools/pdf-to-powerpoint.svg',
  },
  {
    title: 'PDF to Excel',
    description: 'Convert PDF files to Excel spreadsheets in just a few clicks.',
    href: '/tools/pdf-to-excel',
    iconPath: '/images/home/pdf-tools/pdf-to-excel.svg',
  },
  {
    title: 'Word to PDF',
    description: 'Convert your DOC to PDF files online with ease!',
    href: '/tools/word-to-pdf',
    iconPath: '/images/home/pdf-tools/word-to-pdf.svg',
  },
  {
    title: 'PowerPoint to PDF',
    description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
    href: '/tools/powerpoint-to-pdf',
    iconPath: '/images/home/pdf-tools/powerpoint-to-pdf.svg',
  },
  {
    title: 'Excel to PDF',
    description: 'Convert your Excel spreadsheet to PDF online.',
    href: '/tools/excel-to-pdf',
    iconPath: '/images/home/pdf-tools/excel-to-pdf.svg',
  },
  {
    title: 'PDF to JPG',
    description: 'Convert PDF files into JPG images in seconds.',
    href: '/tools/pdf-to-jpg',
    iconPath: '/images/home/pdf-tools/pdf-to-jpg.svg',
  },
  {
    title: 'JPG to PDF',
    description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
    href: '/tools/jpg-to-pdf',
    iconPath: '/images/home/pdf-tools/jpg-to-pdf.svg',
  },
  {
    title: 'Rotate PDF',
    description: 'Change the orientation or rotate PDF pages in just one click.',
    href: '/tools/rotate-pdf',
    iconPath: '/images/home/pdf-tools/rotate.svg',
  },
  {
    title: 'HTML to PDF',
    description: 'Convert HTML files or web pages into PDF files online and in one click.',
    href: '/tools/html-to-pdf',
    iconPath: '/images/home/pdf-tools/html-to-pdf.svg',
  },
  {
    title: 'Unlock PDF',
    description: 'Remove password from PDF files with our online unlock PDF tool.',
    href: '/tools/unlock-pdf',
    iconPath: '/images/home/pdf-tools/unlock.svg',
  },
  {
    title: 'Protect PDF',
    description: 'Add a password protection to your PDF file.',
    href: '/tools/protect-pdf',
    iconPath: '/images/home/pdf-tools/protect.svg',
  },
  {
    title: 'PDF to PDF/A',
    description: 'Convert your PDF to PDF/A for long-term, ISO-standardized archiving.',
    href: '/tools/pdf-to-pdfa',
    iconPath: '/images/home/pdf-tools/pdf-to-pdfa.svg',
  },
  {
    title: 'Repair PDF',
    description: 'Repair damaged PDFs and recover data with our Fix tool.',
    href: '/tools/repair-pdf',
    iconPath: '/images/home/pdf-tools/repair.svg',
  },
  {
    title: 'Add Page Numbers',
    description: 'Easily add page numbers to PDFs with custom position and style.',
    href: '/tools/add-page-numbers',
    iconPath: '/images/home/pdf-tools/page-numbers.svg',
  },
  {
    title: 'Remove Pages',
    description: 'Delete unwanted pages from your PDF quickly and easily.',
    href: '/tools/remove-pages',
    iconPath: '/images/home/pdf-tools/ocr.svg',
  },
  {
    title: 'OCR PDF',
    description: 'Convert scanned PDFs into searchable, selectable documents easily.',
    href: '/tools/ocr-pdf',
    iconPath: '/images/home/pdf-tools/ocr.svg',
  },
  {
    title: 'Edit PDF',
    description: 'Gain full editing control over any PDF document.',
    href: '/tools/edit-pdf',
    iconPath: '/images/home/pdf-tools/edit.svg',
  },
  {
    title: 'Sign PDF',
    description: 'Sign yourself or request electronic signatures from others.',
    href: '/tools/sign-pdf',
    iconPath: '/images/home/pdf-tools/sign.svg',
  },
  {
    title: 'Redact PDF',
    description: 'Redact text and graphics to permanently remove sensitive data from PDFs.',
    href: '/tools/redact-pdf',
    iconPath: '/images/home/pdf-tools/redact.svg',
  },
  {
    title: 'Crop PDF',
    description: 'Trim the edges of your PDF pages to remove unwanted margins.',
    href: '/tools/crop-pdf',
    iconPath: '/images/home/pdf-tools/compress.svg',
  },
  {
    title: 'Organize PDF',
    description: 'Rearrange, add, or delete PDF pages easily.',
    href: '/tools/organize-pdf',
    iconPath: '/images/home/pdf-tools/organize.svg',
  },
  // {
  //   title: 'Watermark PDF',
  //   description: 'Add a watermark to a PDF file in seconds.',
  //   href: '/tools/watermark-pdf',
  //   iconPath: '/images/home/pdf-tools/watermark.svg',
  // },
  // {
  //   title: 'Scan to PDF',
  //   description: 'Scan documents on mobile and send them instantly to your browser.',
  //   href: '/tools/scan-to-pdf',
  //   iconPath: '/images/home/pdf-tools/scan-to-pdf.svg',
  // },
  // {
  //   title: 'Compare PDF',
  //   description: 'Compare documents side by side and spot changes easily.',
  //   href: '/tools/compare-pdf',
  //   iconPath: '/images/home/pdf-tools/compare.svg',
  // },
];

// OCR Language options
export const OCR_LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'nl-NL', label: 'Dutch (Netherlands)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'it-IT', label: 'Italian (Italy)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'sv-SE', label: 'Swedish (Sweden)' },
  { value: 'da-DK', label: 'Danish (Denmark)' },
  { value: 'fi-FI', label: 'Finnish (Finland)' },
  { value: 'nb-NO', label: 'Norwegian (Norway)' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'pt-PT', label: 'Portuguese (Portugal)' },
  { value: 'ca-CA', label: 'English (Canada)' },
  { value: 'nn-NO', label: 'Norwegian (Nynorsk)' },
  { value: 'de-CH', label: 'German (Switzerland)' },
  { value: 'ja-JP', label: 'Japanese (Japan)' },
  { value: 'bg-BG', label: 'Bulgarian (Bulgaria)' },
  { value: 'hr-HR', label: 'Croatian (Croatia)' },
  { value: 'cs-CZ', label: 'Czech (Czech Republic)' },
  { value: 'et-EE', label: 'Estonian (Estonia)' },
  { value: 'el-GR', label: 'Greek (Greece)' },
  { value: 'hu-HU', label: 'Hungarian (Hungary)' },
  { value: 'lv-LV', label: 'Latvian (Latvia)' },
  { value: 'lt-LT', label: 'Lithuanian (Lithuania)' },
  { value: 'pl-PL', label: 'Polish (Poland)' },
  { value: 'ro-RO', label: 'Romanian (Romania)' },
  { value: 'ru-RU', label: 'Russian (Russia)' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'sl-SI', label: 'Slovenian (Slovenia)' },
  { value: 'zh-Hant', label: 'Chinese (Traditional)' },
  { value: 'tr-TR', label: 'Turkish (Turkey)' },
  { value: 'ko-KR', label: 'Korean (Korea)' },
  { value: 'sk-SK', label: 'Slovak (Slovakia)' },
  { value: 'eu-ES', label: 'Basque (Spain)' },
  { value: 'gl-ES', label: 'Galician (Spain)' },
  { value: 'mk-MK', label: 'Macedonian (Macedonia)' },
  { value: 'mt-MT', label: 'Maltese (Malta)' },
  { value: 'sr-SR', label: 'Serbian (Serbia)' },
  { value: 'uk-UA', label: 'Ukrainian (Ukraine)' },
  { value: 'iw-IL', label: 'Hebrew (Israel)' },
];
