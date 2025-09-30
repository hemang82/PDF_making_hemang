import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FileType, ProcessTaskResponse, StartTaskResponse } from '@/types/pdfTools';

type ScreenType = 'upload' | 'preview' | 'download';

type PdfToolState = {
  startTaskResponse: StartTaskResponse;
  setStartTaskResponse: (startTaskResponse: StartTaskResponse) => void;

  screenType: ScreenType;
  setScreenType: (screenType: ScreenType) => void;

  previewFiles: FileType[];
  setPreviewFiles: (files: FileType[]) => void;

  updateFileData: (id: string, newData: Partial<FileType>) => void;
  removePreviewFile: (id: string) => void;

  reorderFiles: (startIndex: number, endIndex: number) => void;

  sortDirection: 'asc' | 'desc';
  sortPreviewFilesByName: () => void;

  downloadInfo: ProcessTaskResponse;
  setDownloadInfo: (downloadInfo: ProcessTaskResponse) => void;
};

export const usePdfToolStore = create<PdfToolState>()(
  devtools((set) => ({
    startTaskResponse: {},
    setStartTaskResponse: (startTaskResponse) => set({ startTaskResponse }),

    screenType: 'upload',
    setScreenType: (screenType) => set({ screenType }),

    previewFiles: [],
    setPreviewFiles: (newFiles) => set((state) => ({ previewFiles: [...state.previewFiles, ...newFiles] })),

    updateFileData: (id: string, newData: Partial<FileType>) =>
      set((state) => ({
        previewFiles: state.previewFiles.map((file) => (file.id === id ? { ...file, ...newData } : file)),
      })),
    removePreviewFile: (id) =>
      set((state) => ({
        previewFiles: state.previewFiles.filter((file) => file.id !== id),
      })),

    reorderFiles: (startIndex, endIndex) =>
      set((state) => {
        const files = [...state.previewFiles];
        const [movedFile] = files.splice(startIndex, 1);
        files.splice(endIndex, 0, movedFile);
        return { previewFiles: files };
      }),

    sortDirection: 'asc',
    sortPreviewFilesByName: () =>
      set((state) => {
        const direction = state.sortDirection === 'asc' ? 'desc' : 'asc';

        const sortFn = (a: { file: File }, b: { file: File }) =>
          direction === 'asc'
            ? a.file.name.localeCompare(b.file.name, undefined, { sensitivity: 'base' })
            : b.file.name.localeCompare(a.file.name, undefined, { sensitivity: 'base' });

        return {
          sortDirection: direction,
          previewFiles: [...state.previewFiles].sort(sortFn),
        };
      }),

    downloadInfo: {},
    setDownloadInfo: (downloadInfo) => set({ downloadInfo }),
  }))
);
