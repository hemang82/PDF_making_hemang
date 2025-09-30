import { type NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/utils/tokenManager';
import { PdfToolSchema, type StartTaskResponse, StartTaskResponseSchema } from '@/types/pdfTools';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const toolParam = req.nextUrl.searchParams.get('tool');
  const toolParse = PdfToolSchema.safeParse(toolParam);

  if (!toolParse.success) {
    return NextResponse.json(
      { error: '[startAPI Error]: Invalid or missing PDF tool name in query or maybe in schema' },
      { status: 400 }
    );
  }

  const tool = toolParse.data;

  try {
    const URL = `https://api.ilovepdf.com/v1/start/${tool}`;
    const token = await getAuthToken();

    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData?.error?.message || 'Unknown error from Start API';
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const rawData = (await response.json()) as StartTaskResponse;
    const parsed = StartTaskResponseSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json({ error: '[startAPI Error]: Invalid task response from start API' }, { status: 500 });
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const formatted = `[startAPI Error]: ${message}`;
    console.error(formatted);
    return NextResponse.json({ error: formatted }, { status: 500 });
  }
}
