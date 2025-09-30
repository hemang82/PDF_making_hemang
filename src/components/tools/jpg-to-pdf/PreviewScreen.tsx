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
import Image from 'next/image';
import { useEffect, useState, type JSX } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { toast } from 'sonner';

import ActionSidebar from '@/components/tool/ActionSidebar';
import AddFileSection from '@/components/tool/AddFileSection';
import EmptyPdfPlaceholder from '@/components/tool/EmptyPdfPlaceholder';
import ProcessingOverlay from '@/components/tool/ProcessingOverlay';
import SidebarToggleButton from '@/components/tool/SidebarToggleButton';
import { useFileUploadHandler } from '@/hooks/useFileUploadHandler';
import { useCustomPdfToolStore, type UploadedFile } from '@/store/useCustomPdfToolStore';

// Sortable Image Item Component
interface SortableImageItemProps {
  file: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  isDragging?: boolean;
  options: {
    orientation: string;
    pageSize: string;
    margin: string;
  };
}

const SortableImageItem = ({
  file,
  index,
  onRemove,
  onRotate,
  isDragging = false,
  options,
}: SortableImageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: file.id });

  const removeAndRotateIconBtnClass =
    'bg-brand-primary hover:bg-brand-primary-dark flex h-[20px] w-[20px] transform cursor-pointer items-center justify-center rounded-full opacity-100 transition-all duration-200 group-hover:opacity-100 hover:scale-110 lg:opacity-0';

  const getModeClasses = () => {
    const visualClasses = {
      mainContainerClasses: '',
      thumbnailClasses: '',
      imageClasses: '',
    };

    if (options.pageSize === 'A4') {
      visualClasses.thumbnailClasses = 'bg-white shadow-sm h-full';
    } else if (options.pageSize === 'letter') {
      visualClasses.thumbnailClasses = 'bg-white shadow-sm h-[90%]';
    } else {
      visualClasses.thumbnailClasses = 'h-full';
    }

    if (options.orientation === 'portrait') {
      visualClasses.mainContainerClasses = 'px-[43px] py-[39px]';
    } else {
      visualClasses.mainContainerClasses = 'px-[12px] py-[44px]';
    }

    if (options.margin === 'small') {
      visualClasses.imageClasses = 'p-[5px]';
    } else if (options.margin === 'big') {
      visualClasses.imageClasses = 'p-[10px]';
    } else {
      visualClasses.imageClasses = '';
    }

    return visualClasses;
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isSortableDragging ? 0.5 : 1 }}
      className={`group hover:border-brand-primary bg-brand-slate-50 relative flex h-[191.28px] w-[166.63px] cursor-move items-center justify-center rounded-md hover:border ${getModeClasses().mainContainerClasses} ${isSortableDragging ? 'border-brand-primary-dark border-2 border-dotted' : ''} ${isDragging ? 'opacity-50' : ''} `}
      {...attributes}
      {...listeners}
    >
      {/* Remove & Rotate Button */}
      <div className='absolute top-[8px] right-[6.3px] flex gap-[5px] opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0'>
        {/* Remove Button */}
        <button
          className={removeAndRotateIconBtnClass}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          aria-label='Remove file'
        >
          <Image
            src='/images/pdf-tools/white-close-icon.svg'
            alt='Close Icon'
            width={16}
            height={16}
            className='h-auto w-auto'
          />
        </button>

        {/* Rotate Button */}
        <button
          className={removeAndRotateIconBtnClass}
          onClick={(e) => {
            e.stopPropagation();
            onRotate(file.id);
          }}
          aria-label='Rotate file'
        >
          <Image
            src='/images/pdf-tools/white-rotate-icon.svg'
            alt='Rotate Icon'
            width={16}
            height={16}
            className='h-auto w-auto'
            style={{ transform: `rotate(${file.rotation || 0}deg)` }}
          />
        </button>
      </div>

      {/* File Number Badge */}
      <div className='bg-brand-primary absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white'>
        {index + 1}
      </div>

      {/* File Name Badge */}
      <div className='bg-brand-primary absolute right-3 bottom-2 left-3 z-10 flex h-6 items-center justify-center rounded-[5px] text-[10px] font-bold text-white'>
        {file.name.length > 18 ? `${file.name.substring(0, 18)}...` : file.name}
      </div>

      {/* Image Thumbnail */}
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden rounded transition-all ${getModeClasses().thumbnailClasses}`}
        style={{ transform: `rotate(${file.rotation}deg)` }}
      >
        <Image
          src={file.previewFileUrl}
          alt={file.name}
          fill
          className={`object-contain ${getModeClasses().imageClasses}`}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
    </div>
  );
};

interface PreviewScreenProps {
  heading: string;
  buttonLabel: string;
  accept: Accept;
  multiple: boolean;
  isCheckPdfPasswordProtected: boolean;
  filesLimit: number;
  maxFileSizePerTaskInBytes: number;
  fileNameAddOn: string;
  tool: string;
  toolName: string;
}

const ImageToPdfPreviewScreen = ({
  heading,
  buttonLabel,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
  fileNameAddOn,
  tool,
  toolName,
}: PreviewScreenProps): JSX.Element => {
  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const reorderFiles = useCustomPdfToolStore((state) => state.reorderFiles);
  const removeUploadedFile = useCustomPdfToolStore((state) => state.removeUploadedFile);
  const rotateUploadedFile = useCustomPdfToolStore((state) => state.rotateUploadedFile);
  const updateFileData = useCustomPdfToolStore((state) => state.updateFileData);
  const setILovePdfDownloadInfo = useCustomPdfToolStore((state) => state.setILovePdfDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Configuration state for image to PDF options
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'no' | 'small' | 'big'>('no');
  const [pageSize, setPageSize] = useState<'A4' | 'letter' | 'fit'>('fit');
  const [mergeAll, setMergeAll] = useState<boolean>(true);

  // Custom hook to handle file upload logic
  const { onDrop } = useFileUploadHandler({
    isCheckPdfPasswordProtected,
    filesLimit,
    maxFileSizePerTaskInBytes,
    accept,
  });

  // File upload dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Combine both accepted and rejected files for our custom validation
      const allFiles = [...acceptedFiles, ...rejectedFiles.map((rejection) => rejection.file)];

      // Call our custom handler with all files (let our validation handle filtering)
      onDrop(allFiles);
    },
    accept,
    multiple,
    noClick: true,
    noKeyboard: true,
  });

  // Responsive Sidebar Toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = uploadedFiles.findIndex((file) => file.id === active.id);
      const newIndex = uploadedFiles.findIndex((file) => file.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFiles(oldIndex, newIndex);
      }
    }

    setActiveId(null);
  };

  const initializeTask = async () => {
    try {
      const response = await fetch(`/api/ilovepdf/start?tool=${tool}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} - Initialize Task Error]:`, errorData?.error);
        toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
        return;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Page InitializeTask Error]:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
    }
  };

  const uploadTask = async (task: string, server: string) => {
    try {
      const uploadPromises = uploadedFiles.map(async (fileItem) => {
        const response = await fetch('/api/ilovepdf/upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData();
            formData.append('file', fileItem.file);
            formData.append('task', task);
            formData.append('server', server);
            return formData;
          })(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`[${toolName} Page InitializeTask Error]:`, errorData?.error);
          toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
          throw new Error('Upload failed');
        }

        const data = await response.json();

        // Update state
        updateFileData(fileItem.id, {
          server_filename: data.server_filename,
        });
      });

      // Wait for all uploads and return the updated files
      await Promise.all(uploadPromises);
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Upload files error:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
      throw error;
    }
  };

  const getMarginValue = (): number => {
    switch (margin) {
      case 'small':
        return 10;
      case 'big':
        return 25;
      case 'no':
      default:
        return 0;
    }
  };

  const processTask = async (task: string, server: string) => {
    const currentFiles = useCustomPdfToolStore.getState().uploadedFiles;

    const filePayload = currentFiles.map((f) => ({
      server_filename: f.server_filename,
      filename: `pdfmaking_${fileNameAddOn}_${f.name}`,
      rotate: f.rotation,
    }));

    try {
      const response = await fetch('/api/ilovepdf/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server,
          task,
          tool,
          files: filePayload,
          orientation: orientation,
          pagesize: pageSize,
          merge_after: mergeAll,
          margin: getMarginValue(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[${toolName} Process error:`, errorData?.error);
        toast.error(`Failed to initialize ${toolName} task. Please refresh and try again.`);
        throw new Error('Process failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error && error.message;
      console.error(`[${toolName} Process error:`, message);
      toast.error(`Failed to prepare ${toolName} task. Please refresh and try again.`);
      throw error;
    }
  };

  // Handle process
  const handleProcess = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Initialize the task
      setProcessingMessage('Initializing task...');
      const taskData = await initializeTask();

      if (!taskData.task || !taskData.server) {
        throw new Error('Failed to initialize task');
      }

      // Step 2: Upload files
      setProcessingMessage('Uploading your files...');

      await uploadTask(taskData.task, taskData.server);

      // Step 3: Process files
      setProcessingMessage('Processing your files...');

      const processResult = await processTask(taskData.task, taskData.server);

      // Step 4: Handle successful processing
      if (processResult) {
        setProcessingMessage('Finalizing files...');
        setILovePdfDownloadInfo({
          ...processResult,
          task: taskData.task,
          server: taskData.server,
        });
        setScreenType('download');
      } else {
        throw new Error('Failed to process files');
      }
    } catch (error) {
      console.error(`${toolName} error:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${toolName} PDFs. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const draggedFile = activeId ? uploadedFiles.find((file) => file.id === activeId) : null;
  const btnDisabledCondition = uploadedFiles.length < 1 || isProcessing;

  const options = {
    orientation,
    pageSize,
    margin,
  };

  return (
    <>
      <div className='flex h-full'>
        {/* Left Side - Image Preview */}
        {/* Left Side - PDF Preview with Drag & Drop */}
        <div
          {...getRootProps({
            className:
              'relative flex h-[calc(100vh-145px)] flex-1 justify-center overflow-auto px-[37.7px] pt-[50px] xl:pt-[100px]',
          })}
        >
          <input {...getInputProps()} aria-label='File input' />

          {/* Drag & Drop Overlay */}
          {isDragActive && (
            <div className='bg-brand-primary/20 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
              <div className='flex flex-col items-center'>
                {/* Upload Icon */}
                <div className='relative mb-4 h-[60px] w-[60px] xl:h-[80px] xl:w-[80px]'>
                  <Image src='/images/pdf-tools/cloud-download-icon.svg' alt='Upload Icon' fill />
                </div>

                {/* Drop Text */}
                <p className='font-inter text-brand-primary text-xl font-semibold xl:text-2xl'>Drop files here</p>
                <p className='font-inter text-brand-slate-600 mt-2 text-base font-normal xl:text-lg'>
                  Release to upload your files
                </p>
              </div>
            </div>
          )}
          {/* File Grid */}
          <div className='mb-[50px] h-fit w-full lg:mx-[75px]'>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={uploadedFiles.map((file) => file.id)} strategy={rectSortingStrategy}>
                <div className='flex flex-col items-center justify-center gap-[11.37px] md:flex-row md:flex-wrap'>
                  {uploadedFiles.map((file, index) => (
                    <SortableImageItem
                      key={file.id}
                      file={file}
                      index={index}
                      onRemove={removeUploadedFile}
                      onRotate={rotateUploadedFile}
                      isDragging={activeId === file.id}
                      options={options}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {draggedFile ? (
                  <SortableImageItem
                    file={draggedFile}
                    index={uploadedFiles.findIndex((f) => f.id === draggedFile.id)}
                    onRemove={removeUploadedFile}
                    onRotate={rotateUploadedFile}
                    isDragging={true}
                    options={options}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>

            {uploadedFiles.length === 0 && <EmptyPdfPlaceholder />}
          </div>

          {/* Add File Section */}
          <AddFileSection fileCount={uploadedFiles.length} onUpload={open} isShowSortFilesButton={true} />
        </div>

        {/* Right Side - Action Sidebar */}
        <ActionSidebar
          heading={heading}
          buttonLabel={buttonLabel}
          isProcessing={isProcessing}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onProcess={handleProcess}
          canProcess={!btnDisabledCondition}
          fileCount={uploadedFiles.length}
        >
          <div className='space-y-6'>
            {/* Description */}
            <p className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
              Convert your images to PDF with customizable settings. Choose orientation, page size, margins, and more.
            </p>

            {/* Page Orientation */}
            <div className='rounded-[10px] bg-white p-[21px]'>
              <h3 className='text-brand-slate-800 mb-4 text-base font-semibold'>Page orientation</h3>
              <div className='flex gap-4'>
                <button
                  onClick={() => setOrientation('portrait')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    orientation === 'portrait'
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`h-10 w-8 rounded border-2 ${orientation === 'portrait' ? 'border-brand-primary' : 'border-gray-300'}`}
                  />
                  <span
                    className={`text-sm ${orientation === 'portrait' ? 'text-brand-primary font-medium' : 'text-gray-600'}`}
                  >
                    Portrait
                  </span>
                </button>
                <button
                  onClick={() => setOrientation('landscape')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    orientation === 'landscape'
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`h-8 w-10 rounded border-2 ${orientation === 'landscape' ? 'border-brand-primary' : 'border-gray-300'}`}
                  />
                  <span
                    className={`text-sm ${orientation === 'landscape' ? 'text-brand-primary font-medium' : 'text-gray-600'}`}
                  >
                    Landscape
                  </span>
                </button>
              </div>
            </div>

            {/* Page Size */}
            <div className='rounded-[10px] bg-white p-[21px]'>
              <h3 className='text-brand-slate-800 mb-4 text-base font-semibold'>Page size</h3>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as 'A4' | 'letter' | 'fit')}
                className='focus:border-brand-primary w-full rounded-lg border border-gray-300 p-3 focus:outline-none'
              >
                <option value='A4'>A4 (297x210 mm)</option>
                <option value='letter'>US Letter (215x279.4 mm)</option>
                <option value='fit'>Fit (Same page size as image)</option>
              </select>
            </div>

            {/* Margin */}
            <div className='rounded-[10px] bg-white p-[21px]'>
              <h3 className='text-brand-slate-800 mb-4 text-base font-semibold'>Margin</h3>
              <div className='flex gap-4'>
                {(['no', 'small', 'big'] as const).map((marginOption) => (
                  <button
                    key={marginOption}
                    onClick={() => setMargin(marginOption)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                      margin === marginOption
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`relative h-8 w-8 rounded border-2 ${margin === marginOption ? 'border-brand-primary' : 'border-gray-300'}`}
                    >
                      {marginOption === 'no' && <div className='h-full w-full rounded bg-gray-200' />}
                      {marginOption === 'small' && <div className='m-auto mt-1 h-3/4 w-3/4 rounded bg-gray-200' />}
                      {marginOption === 'big' && <div className='m-auto mt-2 h-1/2 w-1/2 rounded bg-gray-200' />}
                    </div>
                    <span
                      className={`text-sm capitalize ${margin === marginOption ? 'text-brand-primary font-medium' : 'text-gray-600'}`}
                    >
                      {marginOption} <span className='lowercase'>{marginOption === 'no' ? 'margin' : ''}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Merge All Images Checkbox */}
            <div className='mb-[48px] rounded-[10px] bg-white p-[21px]'>
              <label className='flex cursor-pointer items-center gap-3'>
                <input
                  type='checkbox'
                  checked={mergeAll}
                  onChange={(e) => setMergeAll(e.target.checked)}
                  className='text-brand-primary focus:ring-brand-primary h-5 w-5 rounded border-gray-300 bg-gray-100 focus:ring-2'
                />
                <span className='text-brand-slate-800 font-medium'>Merge all images in one PDF file</span>
              </label>
            </div>

            {uploadedFiles.length < 1 && (
              <p className='mt-5 text-center text-sm text-white/80'>Select at least 1 image file to convert</p>
            )}
          </div>
        </ActionSidebar>
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay isVisible={isProcessing} message={processingMessage} />

      {/* Mobile Sidebar Toggle Button */}
      <SidebarToggleButton
        isSidebarOpen={isSidebarOpen}
        onToggle={() => {
          if (uploadedFiles.length === 0) {
            toast.error('Please upload at least one PDF file to proceed.');
            return;
          }
          setIsSidebarOpen(!isSidebarOpen);
        }}
      />
    </>
  );
};

export default ImageToPdfPreviewScreen;
