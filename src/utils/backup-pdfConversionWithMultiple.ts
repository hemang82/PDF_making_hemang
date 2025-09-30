/* ==================================================
        Approach 1: Sequential Processing
================================================== */

// import type { ConversionOptions, ConversionResult, AdobeAssetResponse } from '@/types/conversion';

// export interface MultipleConversionResult {
//   success: boolean;
//   results: Array<{
//     fileName: string;
//     result: ConversionResult;
//   }>;
//   totalProcessed: number;
//   totalSuccessful: number;
//   totalFailed: number;
// }

// export class PDFConversionService {
//   // ... (keep all existing private methods as they are)

//   public static async convertMultiplePDFs(
//     files: File[],
//     options: ConversionOptions,
//     onProgress?: (current: number, total: number, fileName: string) => void
//   ): Promise<MultipleConversionResult> {
//     const results: Array<{ fileName: string; result: ConversionResult }> = [];
//     let successCount = 0;
//     let failCount = 0;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];

//       // Validate file first
//       const validation = this.validateFile(file);
//       if (!validation.isValid) {
//         results.push({
//           fileName: file.name,
//           result: {
//             success: false,
//             error: validation.error || 'Invalid file',
//           },
//         });
//         failCount++;
//         continue;
//       }

//       // Report progress
//       if (onProgress) {
//         onProgress(i + 1, files.length, file.name);
//       }

//       try {
//         const result = await this.convertPDF(file, options);
//         results.push({
//           fileName: file.name,
//           result,
//         });

//         if (result.success) {
//           successCount++;
//         } else {
//           failCount++;
//         }

//         // Add small delay between requests to be respectful to the API
//         if (i < files.length - 1) {
//           await new Promise((resolve) => setTimeout(resolve, 500));
//         }
//       } catch (error) {
//         results.push({
//           fileName: file.name,
//           result: {
//             success: false,
//             error: error instanceof Error ? error.message : 'Conversion failed',
//           },
//         });
//         failCount++;
//       }
//     }

//     return {
//       success: successCount > 0,
//       results,
//       totalProcessed: files.length,
//       totalSuccessful: successCount,
//       totalFailed: failCount,
//     };
//   }

//   // ... (keep all existing methods)
// }

/* ==================================================
Approach 2: Parallel Processing with Concurrency Control
================================================== */
// import type { ConversionOptions, ConversionResult, AdobeAssetResponse } from '@/types/conversion';

// export interface MultipleConversionResult {
//   success: boolean;
//   results: Array<{
//     fileName: string;
//     result: ConversionResult;
//   }>;
//   totalProcessed: number;
//   totalSuccessful: number;
//   totalFailed: number;
// }

// export class PDFConversionService {
//   // ... (keep all existing private methods as they are)

//   public static async convertMultiplePDFsParallel(
//     files: File[],
//     options: ConversionOptions,
//     concurrency: number = 3, // Limit concurrent requests
//     onProgress?: (completed: number, total: number, fileName: string) => void
//   ): Promise<MultipleConversionResult> {
//     const results: Array<{ fileName: string; result: ConversionResult }> = [];
//     let completed = 0;
//     let successCount = 0;
//     let failCount = 0;

//     // Process files in batches
//     const processBatch = async (batch: File[]): Promise<void> => {
//       const promises = batch.map(async (file) => {
//         // Validate file first
//         const validation = this.validateFile(file);
//         if (!validation.isValid) {
//           const result = {
//             fileName: file.name,
//             result: {
//               success: false,
//               error: validation.error || 'Invalid file'
//             } as ConversionResult
//           };
//           results.push(result);
//           failCount++;
//           completed++;

//           if (onProgress) {
//             onProgress(completed, files.length, file.name);
//           }
//           return;
//         }

//         try {
//           const result = await this.convertPDF(file, options);
//           results.push({
//             fileName: file.name,
//             result
//           });

//           if (result.success) {
//             successCount++;
//           } else {
//             failCount++;
//           }
//         } catch (error) {
//           results.push({
//             fileName: file.name,
//             result: {
//               success: false,
//               error: error instanceof Error ? error.message : 'Conversion failed'
//             }
//           });
//           failCount++;
//         }

//         completed++;
//         if (onProgress) {
//           onProgress(completed, files.length, file.name);
//         }
//       });

//       await Promise.all(promises);
//     };

//     // Process files in concurrent batches
//     for (let i = 0; i < files.length; i += concurrency) {
//       const batch = files.slice(i, i + concurrency);
//       await processBatch(batch);
//     }

//     return {
//       success: successCount > 0,
//       results,
//       totalProcessed: files.length,
//       totalSuccessful: successCount,
//       totalFailed: failCount
//     };
//   }

//   // Utility method to validate multiple files at once
//   public static validateMultipleFiles(files: File[]): Array<{ file: File; isValid: boolean; error?: string }> {
//     return files.map(file => ({
//       file,
//       ...this.validateFile(file)
//     }));
//   }

//   // ... (keep all existing methods)
// }

// EXAMPLE
// Sequential processing
// const files = [file1, file2, file3]; // Your File objects
// const options = { targetFormat: 'docx', ocrEnabled: true };

// const result = await PDFConversionService.convertMultiplePDFs(
//   files,
//   options,
//   (current, total, fileName) => {
//     console.log(`Processing ${current}/${total}: ${fileName}`);
//   }
// );

// console.log(`Processed ${result.totalProcessed} files`);
// console.log(`Successful: ${result.totalSuccessful}, Failed: ${result.totalFailed}`);

// Parallel processing (faster but more resource intensive)
// const parallelResult = await PDFConversionService.convertMultiplePDFsParallel(
//   files,
//   options,
//   3, // Max 3 concurrent conversions
//   (completed, total, fileName) => {
//     console.log(`Completed ${completed}/${total}: ${fileName}`);
//   }
// );
