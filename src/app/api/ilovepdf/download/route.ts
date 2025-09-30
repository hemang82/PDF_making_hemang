import { getAuthToken } from '@/utils/tokenManager';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const DownloadReqSchema = z.object({
  task: z.string(),
  server: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = DownloadReqSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid download request', issues: parsed.error.format() }, { status: 400 });
    }

    const { task, server } = parsed.data;

    const URL = `https://${server}/v1/download/${task}`;
    const token = await getAuthToken();

    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData?.error?.message || 'Unknown error from Download API';
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="downloaded_file"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const formatted = `[Download API Error]: ${message}`;
    console.error(formatted);
    return NextResponse.json({ error: formatted }, { status: 500 });
  }
}
