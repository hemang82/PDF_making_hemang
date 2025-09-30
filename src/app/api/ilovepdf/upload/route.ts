import { type NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/utils/tokenManager';
import { type UploadTaskResponse, UploadTaskResponseSchema } from '@/types/pdfTools';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();

    if (!formData) {
      return NextResponse.json({ error: '[uploadAPI Error]: Missing form data' }, { status: 400 });
    }

    const task = formData.get('task') as string;
    const server = formData.get('server') as string;
    const file = formData.get('file') as File;
    const cloud_file = formData.get('cloud_file') as string;

    if (!task || !server) {
      return NextResponse.json({ error: 'Missing taskId or server' }, { status: 400 });
    }

    // Check if either file or cloud_file is provided
    if (!file && !cloud_file) {
      return NextResponse.json({ error: 'Either file or cloud_file must be provided' }, { status: 400 });
    }

    const token = await getAuthToken();

    const uploadFormData = new FormData();
    uploadFormData.append('task', task);

    // Add either file or cloud_file based on what's provided
    if (cloud_file) {
      uploadFormData.append('cloud_file', cloud_file);
    } else if (file) {
      uploadFormData.append('file', file);
    }

    const response = await fetch(`https://${server}/v1/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData?.error?.message || 'Unknown error from Upload API';
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const rawData = (await response.json()) as UploadTaskResponse;
    const parsed = UploadTaskResponseSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json({ error: '[uploadAPI Error]: Invalid task response from upload API' }, { status: 500 });
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const formatted = `[uploadAPI Error]: ${message}`;
    console.error(formatted);
    return NextResponse.json({ error: formatted }, { status: 500 });
  }
}
