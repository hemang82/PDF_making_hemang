import { type NextRequest, NextResponse } from 'next/server';
import { PDFConversionService } from '@/utils/pdfConversion';
import { type ConversionOptions } from '@/types/conversion';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('targetFormat') as ConversionOptions['targetFormat'];
    const ocrEnabled = formData.get('ocrEnabled') === 'true';
    const ocrLang = (formData.get('ocrLang') as string) || 'en-US';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!targetFormat) {
      return NextResponse.json({ error: 'Target format is required' }, { status: 400 });
    }

    // Validate target format
    const validFormats = ['doc', 'docx', 'pptx', 'xlsx', 'rtf'];
    if (!validFormats.includes(targetFormat)) {
      return NextResponse.json({ error: 'Invalid target format' }, { status: 400 });
    }

    // Validate file
    const validation = PDFConversionService.validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Convert PDF
    const result = await PDFConversionService.convertPDF(file, {
      targetFormat,
      ocrEnabled,
      ocrLang,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      downloadUri: result.downloadUri,
      fileName: result.fileName,
    });
  } catch (error) {
    console.error('PDF conversion error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Conversion failed' }, { status: 500 });
  }
}
