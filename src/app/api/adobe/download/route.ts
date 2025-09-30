import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const downloadUri = searchParams.get('uri');
  const fileName = searchParams.get('fileName') || 'converted.docx';

  if (!downloadUri) {
    return NextResponse.json({ error: 'Download URI is required' }, { status: 400 });
  }

  try {
    // Fetch the file from Adobe's download URI
    const response = await fetch(downloadUri);

    if (!response.ok) {
      throw new Error('Failed to download file from Adobe');
    }

    const fileBuffer = await response.arrayBuffer();

    // Return the file as a downloadable response
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}

// const handleDownload = async (downloadUri: string, fileName: string) => {
//   try {
//     const response = await fetch(
//       `/api/pdf/download?uri=${encodeURIComponent(downloadUri)}&fileName=${encodeURIComponent(fileName)}`
//     );

//     if (!response.ok) {
//       throw new Error('Download failed');
//     }

//     // Create blob and download
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = fileName;
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   } catch (error) {
//     console.error('Download error:', error);
//     toast.error('Failed to download file');
//   }
// };
