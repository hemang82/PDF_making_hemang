'use client';

import ActionSidebar from '@/components/tool/ActionSidebar';
import ProcessingOverlay from '@/components/tool/ProcessingOverlay';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function WebViewer({
  heading,
  buttonLabel,
  description,
  accept,
  multiple,
  isCheckPdfPasswordProtected,
  filesLimit,
  maxFileSizePerTaskInBytes,
  fileNameAddOn,
  tool,
  toolName,
}) {
  const pathname = usePathname();
  const viewer = useRef(null);
  const instanceRef = useRef(null); // Store the WebViewer instance

  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const setDownloadInfo = useCustomPdfToolStore((state) => state.setDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Processing...');

  useEffect(() => {
    import('@pdftron/webviewer').then((module) => {
      const WebViewer = module.default;
      WebViewer({
        path: '/lib/webviewer',
        licenseKey: 'demo:1758799091628:605b7e4e03000000006a989fd2cfdabd6615ce89a05dcee4da85e10372',
        initialDoc: uploadedFiles?.length > 0 ? uploadedFiles[0]?.previewFileUrl : 'https://apryse.s3.amazonaws.com/public/files/samples/WebviewerDemoDoc.pdf',
        fullAPI: true,
      }, viewer.current).then((instance) => {
        instanceRef.current = instance;
        const { UI, Core } = instance;
        const { documentViewer, Annotations } = Core;
        const { Color } = Annotations;

        // ✅ Load document dynamically
        if (uploadedFiles[0]?.previewFileUrl) {
          Core.documentViewer.loadDocument(uploadedFiles[0].previewFileUrl, {
            filename: uploadedFiles[0].name,
          });
        }

        // ✅ Set correct toolbar group based on route
        if (pathname === '/tools/redact-pdf') {
          // ✅ Reduction PDF Code
          instance.Core.annotationManager.enableRedaction();
          UI.disableElements([
            // 'toolbarGroup-View',
            'toolbarGroup-Annotate',
            'toolbarGroup-Shapes',
            'toolbarGroup-Edit',
            'toolbarGroup-Insert',
            'toolbarGroup-Forms',
            'toolbarGroup-FillAndSign',
            // 'toolbarGroup-Redact',
            'menuButton',
            'downloadButton',
            'searchButton',
            'viewControlsButton',
            // 'leftPanelButton',
            'contextMenuPopup',
          ]);
          UI.enableFeatures([UI.Feature.Redaction]);
          UI.setToolbarGroup(UI.ToolbarGroup.VIEW);
        } else if (pathname === '/tools/compare-pdf') {
          // Disable unnecessary UI items
          UI.disableElements([
            'toolbarGroup-Annotate',
            'toolbarGroup-Shapes',
            'toolbarGroup-Edit',
            'toolbarGroup-Insert',
            'toolbarGroup-Forms',
            'toolbarGroup-FillAndSign',
            'toolbarGroup-Redact',
            'menuButton',
            'downloadButton',
            'searchButton',
            'viewControlsButton',
            'contextMenuPopup',
            'leftPanelButton'
          ]);
          // Enable MultiViewer mode
          UI.openElements(['comparePanel']);
          UI.enableFeatures([UI.Feature.MultiViewerMode]);
          UI.setToolbarGroup(UI.ToolbarGroup.VIEW);
          
          UI.addEventListener(UI.Events.MULTI_VIEWER_READY, () => {
            const [documentViewer1, documentViewer2] = Core.getDocumentViewers();
            // ✅ Optionally, open Compare panel automatically
            instance.UI.openElements(['comparePanel']);

            const startCompare = async () => {
              const shouldCompare = documentViewer1.getDocument() && documentViewer2.getDocument();
              // if (shouldCompare) {
              //   // ✅ Use the right Color API (works in WebViewer 10+)
              //   const beforeColor = new Annotations.Color(21, 205, 131, 0.4);
              //   const afterColor = new Annotations.Color(255, 73, 73, 0.4);

              //   const options = { beforeColor, afterColor };
              //   await documentViewer1.startSemanticDiff(documentViewer2, options);

              //   // ✅ Switch to Compare Pages layout automatically
              //   UI.setLayoutMode(UI.LayoutMode.Compare);
              // }
            };

            // Attach events for when docs are loaded
            documentViewer1.addEventListener('documentLoaded', startCompare);
            documentViewer2.addEventListener('documentLoaded', startCompare);

            // Load PDFs (replace with your dynamic values if needed)
            documentViewer1.loadDocument(
              'https://apryse.s3.amazonaws.com/public/files/samples/WebviewerDemoDoc.pdf',
              { filename: 'first.pdf' }
            );

            documentViewer2.loadDocument(
              'https://apryse.s3.amazonaws.com/public/files/samples/WebviewerDemoDoc.pdf',
              { filename: 'second.pdf' }
            );

          });
        }
        else if (pathname === '/tools/organize-pdf') {
          //  ✅ Organize PDF Code
          UI.disableElements([
            // 'toolbarGroup-View',
            'toolbarGroup-Annotate',
            'toolbarGroup-Shapes',
            'toolbarGroup-Edit',
            'toolbarGroup-Insert',
            'toolbarGroup-Forms',
            'toolbarGroup-FillAndSign',
            'toolbarGroup-Redact',
            'menuButton',
            'downloadButton',
            'searchButton',
            'viewControlsButton',
            // 'leftPanelButton',
            'contextMenuPopup',
          ]);
          // UI.enableElements(['cropButton']);
          UI.setToolbarGroup(UI.ToolbarGroup.VIEW);
        } else if (pathname === '/tools/crop-pdf') {
          //  ✅ Crop PDF Code
          UI.disableElements([
            // 'toolbarGroup-View',
            'toolbarGroup-Annotate',
            'toolbarGroup-Shapes',
            // 'toolbarGroup-Edit',
            'toolbarGroup-Insert',
            'toolbarGroup-Forms',
            'toolbarGroup-FillAndSign',
            // 'toolbarGroup-Redact',
            'menuButton',
            'downloadButton',
            'searchButton',
            'viewControlsButton',
            // 'leftPanelButton',
            'contextMenuPopup',
          ]);
          UI.enableElements(['cropButton']);
          UI.setToolbarGroup(UI.ToolbarGroup.VIEW);
        } else if (pathname === '/tools/sign-pdf') {
          // ✅ Sign PDF Code
          UI.disableElements([
            'toolbarGroup-View',
            'toolbarGroup-Annotate',
            'toolbarGroup-Shapes',
            'toolbarGroup-Edit',
            'toolbarGroup-Insert',
            'toolbarGroup-Forms',
            // 'toolbarGroup-FillAndSign',
            'toolbarGroup-Redact',
            'menuButton',
            'downloadButton',
            'searchButton',
            'viewControlsButton',
            'leftPanelButton',
            'contextMenuPopup',
          ]);
          UI.setToolbarGroup(UI.ToolbarGroup?.FILL_AND_SIGN);
        } else {
          // ✅ Edit PDF Code
          UI.disableElements([
            'toolbarGroup-View',
            // 'toolbarGroup-Annotate',
            // 'toolbarGroup-Shapes',
            'toolbarGroup-Edit',
            'toolbarGroup-Insert',
            'toolbarGroup-Forms',
            'toolbarGroup-FillAndSign',
            'toolbarGroup-Redact',
            'menuButton',
            'downloadButton',
            'searchButton',
            'viewControlsButton',
            'leftPanelButton',
            'contextMenuPopup',
          ]);

          UI.enableFeatures([UI.Feature.ContentEdit]);
          UI.setToolbarGroup(UI.ToolbarGroup.SHAPES);
          UI.setToolbarGroup(UI.ToolbarGroup.ANNOTATE);

          //  ✅ watermarkButton PDF Code
          // UI.disableElements([
          //     // 'toolbarGroup-View',
          //     // 'toolbarGroup-Annotate',
          //     'toolbarGroup-Shapes',
          //     // 'toolbarGroup-Edit',
          //     'toolbarGroup-Insert',
          //     'toolbarGroup-Forms',
          //     'toolbarGroup-FillAndSign',
          //     'toolbarGroup-Redact',
          //     'menuButton',
          //     'downloadButton',
          //     'searchButton',
          //     'viewControlsButton',
          //     // 'leftPanelButton',
          //     'contextMenuPopup',
          // ]);
          // // UI.enableElements(['cropButton']);
          // UI.enableElements(['watermarkButton']);
          // UI.setToolbarGroup(UI.ToolbarGroup.VIEW);
          // documentViewer.setWatermark({
          //     // Draw diagonal watermark in middle of the document
          //     diagonal: {
          //         fontSize: 25, // or even smaller size
          //         fontFamily: 'sans-serif',
          //         color: 'red',
          //         opacity: 50, // from 0 to 100
          //         text: 'Watermark Data'
          //     },

          //     // Draw header watermark
          //     header: {
          //         fontSize: 10,
          //         fontFamily: 'sans-serif',
          //         color: 'red',
          //         opacity: 70,
          //         left: 'left watermark',
          //         center: 'center watermark',
          //         right: ''
          //     }
          // });
        }

        // ✅ Open left panel + thumbnails tab
        UI.openElements(['leftPanel']);
        UI.openElements(['thumbnailsPanel']);

        // ✅ Re-open after doc load
        documentViewer.addEventListener('documentLoaded', () => {
          console.log('Document loaded ✅');
        });
      });
    });
  }, [pathname]);

  const handleDownload = async () => {
    const instance = instanceRef.current;
    setIsProcessing(true)
    if (!instance) {
      console.error('WebViewer instance not ready yet');
      return;
    }

    const { documentViewer, annotationManager } = instance.Core;

    // ✅ Wait for annotations to be fully loaded
    await documentViewer.getAnnotationsLoadedPromise();

    // ✅ Export all current annotations (in XFDF format)
    const xfdfString = await annotationManager.exportAnnotations();

    // ✅ Generate the PDF with annotations baked in
    const doc = documentViewer.getDocument();
    const data = await doc.getFileData({
      downloadType: 'pdf',
      xfdfString, // ⬅️ Include annotation data here
    });

    // ✅ Create a blob and download
    const blob = new Blob([data], { type: 'application/pdf' });

    setDownloadInfo({
      processedFileUrl: blob,
      processedFileName: 'edit-pdf.pdf',
    });

    // ⏳ Delay turning off processing
    setTimeout(() => {
      setIsProcessing(false);
      setScreenType('download');
    }, 1000);

    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'downloaded-document.pdf';
    // link.click();
  };

  return (
    <>
      <div className='flex'>

        <div
          className='webviewer'
          ref={viewer}
          style={{ height: 'calc(100vh - 152px)', width: 'calc(100% - 420px)', background: '#ffffff' }}
        >
          {' '}
        </div>

        {/* Right Side - Action Sidebar */}
        <ActionSidebar
          heading={heading}
          buttonLabel={buttonLabel}
          isProcessing={isProcessing}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onProcess={() => {
            handleDownload();
          }}
          canProcess={true}
          fileCount={uploadedFiles.length}
        >
          <p className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
            {description}
          </p>
          {/* {uploadedFiles.length < 2 && (
            <p className='mt-5 text-center text-sm text-white/80'>Select at least 2 PDF files to merge</p>
          )} */}
        </ActionSidebar>

      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay isVisible={isProcessing} message={processingMessage} />
    </>
  );
}
