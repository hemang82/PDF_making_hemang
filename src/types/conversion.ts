export interface ConversionOptions {
  targetFormat: 'docx' | 'pptx' | 'xlsx' | 'rtf';
  ocrEnabled?: boolean;
  ocrLang?: string;
}

export interface ConversionResult {
  success: boolean;
  downloadUri?: string;
  fileName?: string;
  error?: string;
}

export interface AdobeAssetResponse {
  uploadUri: string;
  assetID: string;
}
