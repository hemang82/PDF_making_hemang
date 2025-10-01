import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ScreenType = 'upload' | 'preview' | 'download';
type SortOrder = 'asc' | 'desc';

type DownloadInfo = {
  processedFileUrl: string;
  processedFileName: string;
};

interface iLovePdfDownloadInfo {
  task: string;
  server: string;
  download_filename: string;
  filesize: number;
  output_extensions: string;
  output_filenumber: number;
  output_filesize: number;
  status: string;
  timer: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  previewFileUrl: string;
  name: string;
  size: number;
  rotation: number; // Rotation degrees: 0, 90, 180, 270
  numPages?: number;
  server_filename?: string;
}

interface CustomPdfToolState {
  screenType: ScreenType;
  setScreenType: (screenType: ScreenType) => void;

  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;

  removeUploadedFile: (fileId: string) => void;

  rotateUploadedFile: (fileId: string) => void;

  reorderFiles: (startIndex: number, endIndex: number) => void;

  sortOrder: SortOrder | null;
  sortFilesByName: () => void;

  processedFileName: string | null;
  setProcessedFileName: (fileName: string | null) => void;

  downloadInfo: DownloadInfo;
  setDownloadInfo: (downloadInfo: DownloadInfo) => void;

  updateFileData: (id: string, newData: Partial<UploadedFile>) => void;

  iLovePdfDownloadInfo: iLovePdfDownloadInfo;
  setILovePdfDownloadInfo: (downloadInfo: iLovePdfDownloadInfo) => void;

  // Add the missing clearAllFiles method
  clearAllFiles: () => void;
}

export const useCustomPdfToolStore = create<CustomPdfToolState>()(
  devtools(
    (set, get) => ({
      screenType: 'upload',
      setScreenType: (screenType) => set({ screenType }),

      uploadedFiles: [],
      setUploadedFiles: (files) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, ...files],
        })),

      removeUploadedFile: (fileId) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((file) => file.id !== fileId),
        })),

      rotateUploadedFile: (fileId) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.map((file) =>
            file.id === fileId ? { ...file, rotation: (file.rotation + 90) % 360 } : file
          ),
        })),

      updateFileData: (id: string, newData: Partial<UploadedFile>) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.map((file) => (file.id === id ? { ...file, ...newData } : file)),
        })),

      reorderFiles: (startIndex, endIndex) =>
        set((state) => {
          const files = [...state.uploadedFiles];
          const [movedFile] = files.splice(startIndex, 1);
          files.splice(endIndex, 0, movedFile);
          return { uploadedFiles: files };
        }),

      // Sorting functionality
      sortOrder: null,
      sortFilesByName: () => {
        const currentState = get();
        const currentOrder = currentState.sortOrder;

        // Determine next sort order
        let nextOrder: SortOrder;
        if (currentOrder === null || currentOrder === 'desc') {
          nextOrder = 'asc';
        } else {
          nextOrder = 'desc';
        }

        // Sort files based on the new order
        const sortedFiles = [...currentState.uploadedFiles].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (nextOrder === 'asc') {
            return nameA.localeCompare(nameB);
          } else {
            return nameB.localeCompare(nameA);
          }
        });

        set({
          uploadedFiles: sortedFiles,
          sortOrder: nextOrder,
        });
      },

      processedFileName: null,
      setProcessedFileName: (fileName) => set({ processedFileName: fileName }),

      // downloadInfo: {
      //   processedFileUrl: '',
      //   processedFileName: '',
      // },
      downloadInfo: {
        processedFileUrl: '',
        processedFileName: '',
      },
      setDownloadInfo: (downloadInfo) => set({ downloadInfo }),

      iLovePdfDownloadInfo: null,
      setILovePdfDownloadInfo: (iLovePdfDownloadInfo) => set({ iLovePdfDownloadInfo }),

      // Implementation of the missing clearAllFiles method
      clearAllFiles: () =>
        set({
          uploadedFiles: [],
          processedFileName: null,
          sortOrder: null,
        }),
    }),
    { name: 'CustomPdfToolStore' }
  )
);
