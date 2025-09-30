import { z } from 'zod';

const pdfTools = [
  'compress',
  'officepdf',
  'htmlpdf',
  'pdfocr',
  'repair',
  'pdfjpg',
  'imagepdf',
  'pdfa',
  'rotate',
  'split',
  'merge',
] as const;

export const PdfToolSchema = z.enum(pdfTools);
export type PdfToolForApi = z.infer<typeof PdfToolSchema>;

// ================================================================================

export const StartTaskResponseSchema = z.object({
  task: z.string(), // this is taskId
  server: z.string(),
  remaining_credits: z.number().optional(),
  remaining_files: z.number().optional(),
});

export type StartTaskResponse = z.infer<typeof StartTaskResponseSchema>;

// ================================================================================

export const FileSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  previewUrl: z.string(),
  filename: z.string(),
  server_filename: z.string(),
  uploadStatus: z.enum(['uploading', 'success', 'failed']),
  rotate: z.number(),
  password: z.string(),
});

export type FileType = z.infer<typeof FileSchema>;

// ================================================================================

export const UploadTaskResponseSchema = z.object({
  server_filename: z.string(),
});

export type UploadTaskResponse = z.infer<typeof UploadTaskResponseSchema>;

// ================================================================================

export const ProcessTaskResponseSchema = z.object({
  download_filename: z.string(),
  filesize: z.number(),
  output_filesize: z.number(),
  output_filenumber: z.number(),
  output_extensions: z.string(),
  timer: z.string(),
  status: z.union([z.literal('TaskSuccess'), z.literal('TaskError'), z.string()]),
});

export type ProcessTaskResponse = z.infer<typeof ProcessTaskResponseSchema>;
