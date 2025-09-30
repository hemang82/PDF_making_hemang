import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { PdfToolSchema, type ProcessTaskResponse, ProcessTaskResponseSchema } from '@/types/pdfTools';
import { getAuthToken } from '@/utils/tokenManager';

const RequiredSchema = z.object({
  server: z.string(),
  task: z.string(),
  tool: PdfToolSchema,
  files: z.array(
    z.object({
      server_filename: z.string(),
      filename: z.string(),
      rotate: z.number().optional(),
      password: z.string().optional(),
    })
  ),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsedReqBody = RequiredSchema.safeParse(body);

    if (!parsedReqBody.success) {
      return NextResponse.json(
        { error: 'Missing required fields', issues: parsedReqBody.error.format() },
        { status: 400 }
      );
    }

    // Pass everything through dynamically
    const payload = { ...body };
    console.log('🚀 ~ POST ~ payload:', payload);

    const url = `https://${body.server}/v1/process`;
    const token = await getAuthToken();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData?.error?.message || 'Unknown error from Process API';
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const rawData = (await response.json()) as ProcessTaskResponse;
    const parsed = ProcessTaskResponseSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '[Process API Error]: Invalid task response from process API' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const formatted = `[Process API Error]: ${message}`;
    console.error(formatted);
    return NextResponse.json({ error: formatted }, { status: 500 });
  }
}
