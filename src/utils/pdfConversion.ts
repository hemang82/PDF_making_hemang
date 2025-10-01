import type { ConversionOptions, ConversionResult, AdobeAssetResponse } from '@/types/conversion';

export class PDFConversionService {
  private static async getAccessToken(): Promise<string> {
    const response = await fetch(`${process.env.PDF_SERVICE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.ADOBE_CLIENT_ID!,
        client_secret: process.env.ADOBE_CLIENT_SECRET!,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  private static async createAsset(accessToken: string): Promise<AdobeAssetResponse> {
    const response = await fetch(`${process.env.PDF_SERVICE_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ADOBE_CLIENT_ID!,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        mediaType: 'application/pdf',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create asset: ${response.status}`);
    }

    return await response.json();
  }

  private static async uploadFile(uploadUri: string, file: File): Promise<void> {
    const response = await fetch(uploadUri, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.status}`);
    }
  }

  private static async startExportOperation(
    accessToken: string,
    assetID: string,
    options: ConversionOptions
  ): Promise<string> {
    // const requestBody: any = {
    //   assetID: assetID,
    //   targetFormat: options.targetFormat,
    // };

    const requestBody: {
      assetID: string;
      targetFormat: string;
      ocrLang?: string;
    } = {
      assetID,
      targetFormat: options.targetFormat,
    };
    if (options.ocrEnabled) {
      requestBody.ocrLang = options.ocrLang || 'en-US';
    }

    const response = await fetch(`${process.env.PDF_SERVICE_URL}/operation/exportpdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ADOBE_CLIENT_ID!,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to start export operation: ${response.status}`);
    }

    const location = response.headers.get('location');
    if (!location) {
      throw new Error('Export operation started but no status location was returned.');
    }

    return location;
  }

  private static async pollForStatus(accessToken: string, statusUrl: string): Promise<string> {
    const maxRetries = 20;
    const delayMs = 1500;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ADOBE_CLIENT_ID!,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check status: ${response.status}`);
      }

      const data = await response.json();
      const { status, asset, error } = data;

      if (status === 'done' && asset?.downloadUri) {
        return asset.downloadUri;
      }

      if (status === 'failed') {
        throw new Error(`Export operation failed: ${error || 'Unknown error'}`);
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error('Export timed out after multiple polling attempts.');
  }

  public static async convertPDF(file: File, options: ConversionOptions): Promise<ConversionResult> {
    try {
      // Step 1: Get Access Token
      const accessToken = await this.getAccessToken();

      // Step 2: Create Asset
      const { uploadUri, assetID } = await this.createAsset(accessToken);

      // Step 3: Upload PDF File
      await this.uploadFile(uploadUri, file);

      // Step 4: Start Export Operation
      const statusUrl = await this.startExportOperation(accessToken, assetID, options);

      // Step 5: Poll for Status
      const downloadUri = await this.pollForStatus(accessToken, statusUrl);

      // Get file extension based on target format
      const getFileExtension = (format: string) => {
        switch (format) {
          case 'docx':
            return '.docx';
          case 'pptx':
            return '.pptx';
          case 'xlsx':
            return '.xlsx';
          case 'rtf':
            return '.rtf';
          default:
            return '.docx';
        }
      };

      return {
        success: true,
        downloadUri,
        fileName: file.name.replace('.pdf', getFileExtension(options.targetFormat)),
      };
    } catch (error) {
      console.error('PDF conversion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Conversion failed',
      };
    }
  }

  public static validateFile(file: File): { isValid: boolean; error?: string } {
    // Validate file type
    if (file.type !== 'application/pdf') {
      return { isValid: false, error: 'Only PDF files are allowed' };
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size too large (max 10MB)' };
    }

    return { isValid: true };
  }

  public static getFormatDisplayName(format: string): string {
    switch (format) {
      case 'docx':
        return 'Word Document (.docx)';
      case 'pptx':
        return 'PowerPoint (.pptx)';
      case 'xlsx':
        return 'Excel (.xlsx)';
      case 'rtf':
        return 'Rich Text Format (.rtf)';
      default:
        return format;
    }
  }
}
