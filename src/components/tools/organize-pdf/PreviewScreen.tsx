'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, Menu, Plus, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';

import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { useCustomPdfToolStore, type UploadedFile } from '@/store/useCustomPdfToolStore';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PreviewScreenProps {
  heading: string;
  buttonLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
}

interface PageItem {
  id: string;
  fileId: string;
  fileName: string;
  pageNumber: number;
  rotation: number;
  isBlankPage: boolean;
  originalFileColor: string;
}

interface SortablePageItemProps {
  page: PageItem;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  onAddBlankBefore: (index: number) => void;
  onAddBlankAfter: (index: number) => void;
  uploadedFiles: UploadedFile[];
  isDragging?: boolean;
}

const FILE_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Purple
  '#FFB347', // Orange
  '#87CEEB', // Sky Blue
];

const SortablePageItem = ({
  page,
  index,
  onRemove,
  onRotate,
  onAddBlankBefore,
  onAddBlankAfter,
  uploadedFiles,
  isDragging = false,
}: SortablePageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: page.id });

  const [showAddOptions, setShowAddOptions] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const borderColor = page.isBlankPage ? '#E5E7EB' : page.originalFileColor;

  const getFileForPage = () => {
    if (page.isBlankPage) return null;
    return uploadedFiles.find((file) => file.id === page.fileId);
  };

  const file = getFileForPage();

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderColor,
        backgroundColor: page.isBlankPage ? '#F9FAFB' : '#F8FAFC',
      }}
      className={`group relative flex h-[191.28px] w-[166.63px] cursor-move items-center rounded-md px-[43px] py-[39px] transition-all duration-200 ${
        isSortableDragging ? 'border-2 border-dotted border-gray-600' : 'border-2 border-solid hover:border-gray-400'
      } ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setShowAddOptions(true)}
      onMouseLeave={() => setShowAddOptions(false)}
    >
      {/* Page Number Badge */}
      <div
        className='absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'
        style={{ backgroundColor: borderColor }}
      >
        {index + 1}
      </div>

      {/* Remove & Rotate Button */}
      <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-0 transition-opacity group-hover:opacity-100'>
        {/* Remove Button */}
        <button
          className='flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full bg-red-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-red-600'
          onClick={(e) => {
            e.stopPropagation();
            onRemove(page.id);
          }}
          aria-label='Remove page'
        >
          <X size={12} className='text-white' />
        </button>

        {/* Rotate Button */}
        {!page.isBlankPage && (
          <button
            className='flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full bg-blue-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-blue-600'
            onClick={(e) => {
              e.stopPropagation();
              onRotate(page.id);
            }}
            aria-label='Rotate page'
          >
            <Image
              src='/images/pdf-tools/white-rotate-icon.svg'
              alt='Rotate Icon'
              width={12}
              height={12}
              className='h-auto w-auto'
              style={{ transform: `rotate(${page.rotation}deg)` }}
            />
          </button>
        )}
      </div>

      {/* Add Blank Page Options */}
      {showAddOptions && (
        <>
          {/* Add Before Button */}
          <button
            className='absolute top-1/2 left-[-15px] z-20 flex h-[30px] w-[30px] transform cursor-pointer items-center justify-center rounded-full bg-green-500 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-green-600'
            onClick={(e) => {
              e.stopPropagation();
              onAddBlankBefore(index);
            }}
            aria-label='Add blank page before'
            title='Add blank page before'
          >
            <Plus size={16} />
          </button>

          {/* Add After Button */}
          <button
            className='absolute top-1/2 right-[-15px] z-20 flex h-[30px] w-[30px] transform cursor-pointer items-center justify-center rounded-full bg-green-500 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-green-600'
            onClick={(e) => {
              e.stopPropagation();
              onAddBlankAfter(index);
            }}
            aria-label='Add blank page after'
            title='Add blank page after'
          >
            <Plus size={16} />
          </button>
        </>
      )}

      {/* Page Content */}
      <div className='transition-all' style={{ transform: `rotate(${page.rotation}deg)` }}>
        <div className='relative flex items-center justify-center overflow-hidden'>
          {page.isBlankPage ? (
            <div className='flex h-[113.86px] w-[80.5px] items-center justify-center rounded border-2 border-dashed border-gray-300 bg-white'>
              <span className='text-xs text-gray-500'>Blank</span>
            </div>
          ) : (
            file && (
              <Document file={file.previewFileUrl} className='flex items-center justify-center'>
                <Page
                  pageNumber={page.pageNumber}
                  width={80.5}
                  height={113.86}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className='shadow-sm'
                />
              </Document>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const OrganizePagesPreviewScreen = ({
  heading,
  buttonLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
}: PreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const setProcessedFileName = useCustomPdfToolStore((state) => state.setProcessedFileName);
  const clearAllFiles = useCustomPdfToolStore((state) => state.clearAllFiles);

  const [pages, setPages] = useState<PageItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [fileColors, setFileColors] = useState<Record<string, string>>({});

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom hook to handle file upload logic
  const { onDrop } = useFileUploadHandler({
    isCheckPdfPasswordProtected,
    filesLimit,
    maxFileSizePerTaskInBytes,
    accept,
  });

  const { getInputProps, open } = useDropzone({
    onDrop,
    multiple,
    noClick: true,
    noKeyboard: true,
    noDrag: true,
  });

  // Convert uploaded files to individual pages
  useEffect(() => {
    const newPages: PageItem[] = [];
    const newFileColors: Record<string, string> = {};

    uploadedFiles.forEach((file, fileIndex) => {
      const color = FILE_COLORS[fileIndex % FILE_COLORS.length];
      newFileColors[file.id] = color;

      // Get number of pages from file metadata or default to 1
      const numPages = file.numPages || 1;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        newPages.push({
          id: `${file.id}-page-${pageNum}`,
          fileId: file.id,
          fileName: file.name,
          pageNumber: pageNum,
          rotation: 0,
          isBlankPage: false,
          originalFileColor: color,
        });
      }
    });

    setPages(newPages);
    setFileColors(newFileColors);
  }, [uploadedFiles]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPages((prevPages) => {
        const oldIndex = prevPages.findIndex((page) => page.id === active.id);
        const newIndex = prevPages.findIndex((page) => page.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newPages = [...prevPages];
          const [movedPage] = newPages.splice(oldIndex, 1);
          newPages.splice(newIndex, 0, movedPage);
          return newPages;
        }

        return prevPages;
      });
    }

    setActiveId(null);
  };

  const handleRemovePage = (pageId: string) => {
    setPages((prevPages) => prevPages.filter((page) => page.id !== pageId));
  };

  const handleRotatePage = (pageId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) => (page.id === pageId ? { ...page, rotation: (page.rotation + 90) % 360 } : page))
    );
  };

  const handleAddBlankBefore = (index: number) => {
    const newBlankPage: PageItem = {
      id: `blank-${Date.now()}-${Math.random()}`,
      fileId: '',
      fileName: '',
      pageNumber: 0,
      rotation: 0,
      isBlankPage: true,
      originalFileColor: '#E5E7EB',
    };

    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages.splice(index, 0, newBlankPage);
      return newPages;
    });
  };

  const handleAddBlankAfter = (index: number) => {
    const newBlankPage: PageItem = {
      id: `blank-${Date.now()}-${Math.random()}`,
      fileId: '',
      fileName: '',
      pageNumber: 0,
      rotation: 0,
      isBlankPage: true,
      originalFileColor: '#E5E7EB',
    };

    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages.splice(index + 1, 0, newBlankPage);
      return newPages;
    });
  };

  const handleResetAll = () => {
    // Reset to original order and remove blank pages
    const originalPages: PageItem[] = [];

    uploadedFiles.forEach((file, fileIndex) => {
      const color = FILE_COLORS[fileIndex % FILE_COLORS.length];
      const numPages = file.numPages || 1;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        originalPages.push({
          id: `${file.id}-page-${pageNum}`,
          fileId: file.id,
          fileName: file.name,
          pageNumber: pageNum,
          rotation: 0,
          isBlankPage: false,
          originalFileColor: color,
        });
      }
    });

    setPages(originalPages);
    toast.success('Pages reset to original order');
  };

  // Create API payload
  const createApiPayload = () => {
    const pagesToRemove: string[] = [];
    const insertBlankPageAfter: string[] = [];
    const dataDict: Record<string, number> = {};

    pages.forEach((page, index) => {
      if (page.isBlankPage) {
        // For blank pages, we need to insert them after the previous page
        if (index > 0) {
          const prevPage = pages[index - 1];
          if (!prevPage.isBlankPage) {
            insertBlankPageAfter.push(`${prevPage.fileId}-${prevPage.pageNumber}`);
          }
        }
      } else {
        // For regular pages, record rotation
        dataDict[`${page.fileId}-${page.pageNumber}`] = page.rotation;
      }
    });

    // Find removed pages by comparing with original
    const currentPageIds = new Set(pages.filter((p) => !p.isBlankPage).map((p) => `${p.fileId}-${p.pageNumber}`));
    uploadedFiles.forEach((file) => {
      const numPages = file.numPages || 1;
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const pageId = `${file.id}-${pageNum}`;
        if (!currentPageIds.has(pageId)) {
          pagesToRemove.push(pageId);
        }
      }
    });

    return {
      pages_to_remove: pagesToRemove.join(','),
      insert_blank_page_after: insertBlankPageAfter.join(','),
      data_dict: JSON.stringify(dataDict),
    };
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    const toastId = toast.loading('Organizing pages...');

    try {
      const formData = new FormData();

      // Add files to FormData
      uploadedFiles.forEach((fileItem) => {
        formData.append('file', fileItem.file);
      });

      // Add API payload
      const payload = createApiPayload();
      formData.append('pages_to_remove', payload.pages_to_remove);
      formData.append('insert_blank_page_after', payload.insert_blank_page_after);
      formData.append('data_dict', payload.data_dict);

      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}organize-pages`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        if (setProcessedFileName) {
          setProcessedFileName(result.data.file);
        }
        setScreenType('download');
        toast.success('Pages organized successfully!');
      } else {
        throw new Error(result.message || 'Failed to organize pages');
      }
    } catch (error) {
      console.error('Organize error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to organize pages. Please try again.');
    } finally {
      toast.dismiss(toastId);
      setIsProcessing(false);
    }
  };

  const draggedPage = activeId ? pages.find((page) => page.id === activeId) : null;

  return (
    <div className='flex h-full'>
      {/* Mobile Sidebar Toggle Button */}
      <button
        type='button'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-[200px] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#51BCD0] text-white shadow-lg transition-all duration-200 hover:bg-[#45A8BC] lg:hidden ${isSidebarOpen ? 'right-[430px]' : 'right-4'}`}
      >
        {isSidebarOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
      </button>

      {/* Left Side - PDF Preview */}
      <div className='relative flex h-[calc(100vh-145px)] flex-1 justify-center overflow-auto px-[37.7px] pt-[50px] xl:pt-[100px]'>
        {/* File Grid */}
        <div className='mb-[50px] h-fit w-full lg:mx-[75px]'>
          <input {...getInputProps()} aria-label='File input' />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={pages.map((page) => page.id)} strategy={rectSortingStrategy}>
              <div className='flex flex-wrap justify-center gap-[11.37px]'>
                {pages.map((page, index) => (
                  <SortablePageItem
                    key={page.id}
                    page={page}
                    index={index}
                    onRemove={handleRemovePage}
                    onRotate={handleRotatePage}
                    onAddBlankBefore={handleAddBlankBefore}
                    onAddBlankAfter={handleAddBlankAfter}
                    uploadedFiles={uploadedFiles}
                    isDragging={activeId === page.id}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {draggedPage ? (
                <SortablePageItem
                  page={draggedPage}
                  index={pages.findIndex((p) => p.id === draggedPage.id)}
                  onRemove={handleRemovePage}
                  onRotate={handleRotatePage}
                  onAddBlankBefore={handleAddBlankBefore}
                  onAddBlankAfter={handleAddBlankAfter}
                  uploadedFiles={uploadedFiles}
                  isDragging={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          {pages.length === 0 && (
            <div className='rounded-xl border-2 border-dashed border-gray-300 p-2 py-12 text-center text-gray-500'>
              <FileText className='mx-auto mb-4 h-12 w-12 text-gray-300' />
              <p className='mb-2 text-lg font-medium'>No PDF files uploaded yet</p>
              <p className='text-sm'>Upload PDF files to organize pages</p>
            </div>
          )}
        </div>

        {/* Add File Button */}
        <div className='absolute top-[100px] right-[37.7px] flex flex-col items-center gap-3'>
          <div className='bg-brand-primary shadow-custom-badge-md absolute top-[-15px] left-[-15px] z-20 h-[34.5] w-[34.5] rounded-full text-center text-[24.15px] text-white'>
            {pages.length}
          </div>

          <button
            type='button'
            className='bg-brand-primary hover:bg-brand-primary-dark relative z-10 flex h-[66.5px] w-[66.5px] transform cursor-pointer items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105'
            onClick={open}
          >
            <Upload className='h-6 w-6' />
          </button>
        </div>
      </div>

      {/* Right Side - Action Panel */}
      <div
        className={`bg-brand-primary fixed right-0 z-20 flex h-[calc(100vh-145px)] w-[300px] transform flex-col justify-between p-6 transition-transform duration-300 md:w-[420px] lg:relative lg:inset-y-auto lg:translate-x-0 lg:p-[30px] ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex flex-col items-center'>
          <h1 className='mb-2 text-center text-3xl font-semibold text-white lg:mb-[20px] lg:text-[36px]/[48px]'>
            {heading}
          </h1>

          <p className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
            Organize your PDF pages by dragging and dropping. Add blank pages by hovering over thumbnails and clicking
            the + buttons.
          </p>

          {/* File List */}
          <div className='mt-4 w-full'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium text-white'>Files:</span>
              <button
                onClick={handleResetAll}
                className='text-sm font-medium text-red-200 underline hover:text-red-100'
              >
                Reset all
              </button>
            </div>
            <div className='space-y-2'>
              {uploadedFiles.map((file, index) => (
                <div key={file.id} className='flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2'>
                  <div className='h-3 w-3 rounded-full' style={{ backgroundColor: fileColors[file.id] }} />
                  <span className='flex-1 truncate text-sm text-white'>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Button */}
        <button
          type='button'
          onClick={handleProcess}
          aria-label={buttonLabel}
          disabled={pages.length === 0 || isProcessing}
          className='shadow-custom-3d-md hover:bg-brand-white-dark flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-black bg-white px-[30px] py-[15px] text-base font-bold transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-200 disabled:text-gray-500 lg:px-[60px] lg:py-[25px] lg:text-[20px]/[17.92px]'
        >
          {isProcessing ? (
            <>
              <div className='border-brand-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent' />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{buttonLabel}</span>
              <Image
                src='/images/pdf-tools/black-right-arrow-icon.svg'
                alt='Black Right Arrow Icon'
                width={15}
                height={15}
                className='h-auto w-auto'
              />
            </>
          )}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className='bg-opacity-50 fixed inset-0 z-10 backdrop-blur-xs lg:hidden'
          role='button'
          tabIndex={0}
          aria-label='Close sidebar'
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsSidebarOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default OrganizePagesPreviewScreen;
