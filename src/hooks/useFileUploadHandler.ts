import { useCustomPdfToolStore, type UploadedFile } from '@/store/useCustomPdfToolStore';
import { nanoid } from 'nanoid';
import { useCallback, useMemo } from 'react';
import { type Accept } from 'react-dropzone';
import { toast } from 'sonner';

interface UseFileUploadHandlerProps {
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
  accept: Accept;
}

// Constants moved outside component to avoid recreating
const PDF_ENCRYPTION_INDICATORS = [
  '/Filter /Standard',
  '/Filter/Standard',
  '/V 1',
  '/V 2',
  '/V 4',
  '/V 5',
  '/R 2',
  '/R 3',
  '/R 4',
  '/R 5',
  '/R 6',
  '/P -',
  '/U (',
  '/O (',
] as const;

const TOAST_CONFIG = {
  closeButton: true,
  duration: 5000,
} as const;

// Utility functions moved outside component
const formatTotalSize = (totalBytes: number): string => `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

const getFileExtension = (fileName: string): string => `.${fileName.split('.').pop()?.toLowerCase() || ''}`;

export const useFileUploadHandler = ({
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
  accept = { 'application/pdf': ['.pdf'] },
}: UseFileUploadHandlerProps): {
  onDrop: (acceptedFiles: File[]) => Promise<void>;
} => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const setUploadedFiles = useCustomPdfToolStore((state) => state.setUploadedFiles);

  // Memoize accepted file types for performance
  const { acceptedMimeTypes, acceptedExtensions, acceptedTypesString } = useMemo(
    () => ({
      acceptedMimeTypes: Object.keys(accept),
      acceptedExtensions: Object.values(accept).flat(),
      acceptedTypesString: Object.values(accept).flat().join(', '),
    }),
    [accept]
  );

  const isValidFileType = useCallback(
    (file: File): boolean => {
      const mimeTypeMatch = acceptedMimeTypes.includes(file.type);
      const fileExtension = getFileExtension(file.name);
      const extensionMatch = acceptedExtensions.some((ext) => ext.toLowerCase() === fileExtension);

      return mimeTypeMatch || extensionMatch;
    },
    [acceptedMimeTypes, acceptedExtensions]
  );

  const checkIfPDFIsPasswordProtected = useCallback(async (file: File): Promise<boolean> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Quick header check
      const header = String.fromCharCode(...Array.from(uint8Array.slice(0, 8)));
      if (!header.startsWith('%PDF-')) return false;

      const pdfString = new TextDecoder('latin1').decode(uint8Array);

      return (
        pdfString.includes('/Encrypt') && PDF_ENCRYPTION_INDICATORS.some((indicator) => pdfString.includes(indicator))
      );
    } catch (error) {
      console.error('PDF password check failed:', error);
      return false;
    }
  }, []);

  const showToast = useCallback(
    (type: 'protected' | 'unlocked' | 'invalid-type', fileNames: string[]) => {
      const message = fileNames.length === 1 ? `"${fileNames[0]}" is` : `${fileNames.length} files are`;

      const baseConfig = {
        description: '',
        ...TOAST_CONFIG,
      };

      switch (type) {
        case 'protected':
          toast.error(`${message} password protected.`, {
            ...baseConfig,
            description: 'Please remove password before proceeding.',
            action: {
              label: 'Unlock PDF',
              onClick: () => (window.location.href = '/tools/unlock-pdf'),
            },
          });
          break;

        case 'unlocked':
          toast.error(`${message} already unlocked.`, {
            ...baseConfig,
            description: 'This file is not password protected.',
          });
          break;

        case 'invalid-type':
          toast.error(`${message} not a valid file type.`, {
            ...baseConfig,
            description: `Accepted formats: ${acceptedTypesString}`,
          });
          break;
      }
    },
    [acceptedTypesString]
  );

  const showUpgradeToast = useCallback(
    (title: string, description: string, href: string = '/tools/premium-features') => {
      toast.error(title, {
        description,
        action: {
          label: 'Upgrade to Premium',
          onClick: () => (window.location.href = href),
        },
        ...TOAST_CONFIG,
      });
    },
    []
  );

  const validateFiles = useCallback(
    async (files: File[]) => {
      // 1. Validate file types
      const invalidFiles = files.filter((file) => !isValidFileType(file));

      if (invalidFiles.length > 0) {
        showToast(
          'invalid-type',
          invalidFiles.map((f) => f.name)
        );
        return { isValid: false };
      }

      // 2. Validate file count
      const totalFiles = files.length + uploadedFiles.length;
      if (totalFiles > filesLimit) {
        showUpgradeToast(
          `Free limit: ${filesLimit} file(s) per task.`,
          'Upgrade to premium to process unlimited files at once.'
        );
        return { isValid: false };
      }

      // 3. Validate total file size
      const newFilesSize = files.reduce((sum, f) => sum + f.size, 0);
      const existingFilesSize = uploadedFiles.reduce((sum, f) => sum + f.size, 0);
      const totalSize = newFilesSize + existingFilesSize;

      if (totalSize > maxFileSizePerTaskInBytes) {
        showUpgradeToast(
          `Free limit: ${formatTotalSize(maxFileSizePerTaskInBytes)} per task.`,
          `Total file size (${formatTotalSize(totalSize)}) exceeds free limit. Upgrade to premium to process up to 4 GB per task.`
        );
        return { isValid: false };
      }

      // 4. Validate PDF password protection (only for PDF files)
      const pdfFiles = files.filter((f) => f.type === 'application/pdf' || getFileExtension(f.name) === '.pdf');
      const protectedFiles: string[] = [];
      const unlockedFiles: string[] = [];

      for (const file of pdfFiles) {
        const isProtected = await checkIfPDFIsPasswordProtected(file);

        if (isCheckPdfPasswordProtected && isProtected) {
          protectedFiles.push(file.name);
        } else if (!isCheckPdfPasswordProtected && !isProtected) {
          unlockedFiles.push(file.name);
        }
      }

      if (protectedFiles.length > 0) {
        showToast('protected', protectedFiles);
        return { isValid: false };
      }

      if (unlockedFiles.length > 0) {
        showToast('unlocked', unlockedFiles);
        return { isValid: false };
      }

      return { isValid: true };
    },
    [
      isValidFileType,
      uploadedFiles,
      filesLimit,
      maxFileSizePerTaskInBytes,
      isCheckPdfPasswordProtected,
      checkIfPDFIsPasswordProtected,
      showToast,
      showUpgradeToast,
    ]
  );

  const createUploadedFiles = useCallback((files: File[]): UploadedFile[] => {
    return files.map((file) => ({
      id: nanoid(),
      file,
      name: file.name,
      size: file.size,
      rotation: 0,
      previewFileUrl: URL.createObjectURL(file),
      server_filename: '',
    }));
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const validation = await validateFiles(acceptedFiles);

      if (!validation.isValid) {
        return;
      }

      const uploadedFilesList = createUploadedFiles(acceptedFiles);
      setUploadedFiles(uploadedFilesList);
      setScreenType('preview');
    },
    [validateFiles, createUploadedFiles, setUploadedFiles, setScreenType]
  );

  return { onDrop };
};
