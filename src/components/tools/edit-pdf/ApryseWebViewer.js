'use client';

import ActionSidebar from '@/components/tool/ActionSidebar';
import { useCustomPdfToolStore } from '@/store/useCustomPdfToolStore';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function WebViewer({
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
}) {
  const pathname = usePathname();
  const viewer = useRef(null);
  const instanceRef = useRef(null); // Store the WebViewer instance

  const uploadedFiles = useCustomPdfToolStore((state) => state.uploadedFiles);
  const setScreenType = useCustomPdfToolStore((state) => state.setScreenType);
  const setDownloadInfo = useCustomPdfToolStore((state) => state.setDownloadInfo);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // documentViewer.addEventListener('documentLoaded', () => {
  // instance.UI.disableElements([
  //     'toolbarGroup-View',
  //     'toolbarGroup-Annotate',
  //     'toolbarGroup-Edit',
  //     'toolbarGroup-FillAndSign',
  //     'toolbarGroup-Insert',
  //     'toolbarGroup-Forms',
  //     'toolbarGroup-Measure',
  //     'toolbarGroup-Crop',
  //     'toolbarGroup-Redact',
  //     'toolbarGroup-Shapes',
  //     'toolbarGroup-EditText',
  //     'toolbarGroup-BuildForm',
  //     'menuButton'
  // ]);
  // });

  // useEffect(() => {
  //     console.log('uploadedFiles[0]?.previewFileUrl', uploadedFiles[0]?.previewFileUrl);

  //     import('@pdftron/webviewer').then((module) => {
  //         const WebViewer = module.default;
  //         WebViewer(
  //             {
  //                 path: '/lib/webviewer',
  //                 licenseKey: 'demo:1758799091628:605b7e4e03000000006a989fd2cfdabd6615ce89a05dcee4da85e10372',
  //                 initialDoc: uploadedFiles[0] ? uploadedFiles[0].previewFileUrl : 'https://apryse.s3.amazonaws.com/public/files/samples/WebviewerDemoDoc.pdf',
  //             },
  //             viewer.current,
  //         ).then((instance) => {

  //             const { UI, Core } = instance;
  //             const { documentViewer } = instance.Core;

  //             instanceRef.current = instance;

  //             // ✅ Load PDF dynamically after init
  //             if (uploadedFiles[0]?.previewFileUrl) {
  //                 const blobUrl = uploadedFiles[0].previewFileUrl;
  //                 // For a URL (Blob or HTTP), use loadDocument:
  //                 Core.documentViewer.loadDocument(blobUrl, { filename: uploadedFiles[0].name });
  //             }

  //             // ✅ Enable specific features
  //             instance.UI.enableFeatures([instance.UI.Feature.ContentEdit, UI.ToolbarGroup?.ANNOTATE, UI.ToolbarGroup?.SHAPES]);
  //             // instance.UI.enableElements(['readerPageTransitionButton']);

  //             UI.openElements(['leftPanel']);

  //             // ✅ Also reinforce disabling after doc load
  //             documentViewer.addEventListener('documentLoaded', () => {

  //                 // ✅ Disable unwanted elements right after initialization
  //                 console.log('Load SDK');

  //                 UI.disableElements([
  //                     UI.ToolbarGroup?.EDIT,
  //                     // UI.ToolbarGroup?.ANNOTATE,
  //                     UI.ToolbarGroup?.FILL_AND_SIGN,
  //                     UI.ToolbarGroup?.FORMS,
  //                     UI.ToolbarGroup?.VIEW,
  //                     // UI.ToolbarGroup?.SHAPES,
  //                     UI.ToolbarGroup?.INSERT,
  //                     "menuButton"
  //                 ]);
  //             });

  //             // 👉 Instead of enableElements, use setToolbarGroup
  //             if (pathname === '/tools/redact-pdf') {
  //                 UI.setToolbarGroup(UI.ToolbarGroup.REDACT);
  //             } else if (pathname === '/tools/compare-pdf') {
  //                 UI.setToolbarGroup(UI.ToolbarGroup.VIEW); // base group
  //                 UI.enableElements(['toolMenu-Compare']);  // selectively add compare
  //             } else if (pathname === '/tools/sign-pdf') {
  //                 UI.setToolbarGroup(UI.ToolbarGroup.FILL_AND_SIGN);
  //             } else {
  //                 UI.setToolbarGroup(UI.ToolbarGroup.VIEW); // default
  //             }
  //         });
  //     });
  // }, [pathname]);

  useEffect(() => {
    import('@pdftron/webviewer').then((module) => {
      const WebViewer = module.default;
      WebViewer(
        {
          path: '/lib/webviewer',
          licenseKey: 'demo:1758799091628:605b7e4e03000000006a989fd2cfdabd6615ce89a05dcee4da85e10372',
          initialDoc:
            uploadedFiles?.length > 0
              ? uploadedFiles[0]?.previewFileUrl
              : 'https://apryse.s3.amazonaws.com/public/files/samples/WebviewerDemoDoc.pdf',
        },
        viewer.current
      ).then((instance) => {
        const { UI, Core } = instance;
        const { documentViewer } = Core;

        instanceRef.current = instance;

        // ✅ Load document dynamically
        if (uploadedFiles[0]?.previewFileUrl) {
          Core.documentViewer.loadDocument(uploadedFiles[0].previewFileUrl, {
            filename: uploadedFiles[0].name,
          });
        }

        // // ✅ Disable unwanted elements right away
        // UI.disableElements([
        //     UI.ToolbarGroup?.EDIT,
        //     UI.ToolbarGroup?.FILL_AND_SIGN,
        //     UI.ToolbarGroup?.FORMS,
        //     UI.ToolbarGroup?.VIEW,
        //     UI.ToolbarGroup?.INSERT,
        //     "menuButton",
        // ]);

        // ✅ Set correct toolbar group based on route
        if (pathname === '/tools/redact-pdf') {
          UI.setToolbarGroup(UI.ToolbarGroup.REDACT);
        } else if (pathname === '/tools/compare-pdf') {
          UI.setToolbarGroup(UI.ToolbarGroup.VIEW);
          UI.enableElements(['toolMenu-Compare']);
        } else if (pathname === '/tools/sign-pdf') {
          UI.setToolbarGroup(UI.ToolbarGroup.FILL_AND_SIGN);
        } else {
          // ✅ Edit PDF Code
          UI.disableElements([
            // 'toolbarGroup-View',
            // 'toolbarGroup-Annotate',
            // 'toolbarGroup-Shapes',
            // 'toolbarGroup-Edit',
            // 'toolbarGroup-Insert',
            // 'toolbarGroup-Forms',
            // 'toolbarGroup-FillAndSign',
            // 'toolbarGroup-Redact',
            // 'menuButton',
            // 'downloadButton',
            // 'searchButton',
            // 'viewControlsButton',
            // 'leftPanelButton',
            // 'contextMenuPopup',
          ]);

          UI.enableFeatures([UI.Feature.ContentEdit]);
          UI.setToolbarGroup(UI.ToolbarGroup.SHAPES);
          UI.setToolbarGroup(UI.ToolbarGroup.ANNOTATE);

          // ✅ Sign PDF Code
          // UI.disableElements([
          //     'toolbarGroup-View',
          //     'toolbarGroup-Annotate',
          //     'toolbarGroup-Shapes',
          //     'toolbarGroup-Edit',
          //     'toolbarGroup-Insert',
          //     'toolbarGroup-Forms',
          //     // 'toolbarGroup-FillAndSign',
          //     'toolbarGroup-Redact',
          //     'menuButton',
          //     'downloadButton',
          //     'searchButton',
          //     'viewControlsButton',
          //     'leftPanelButton',
          //     'contextMenuPopup',
          // ]);
          // UI.setToolbarGroup(UI.ToolbarGroup?.FILL_AND_SIGN);

          // //  ✅ Sign PDF Code
          // UI.disableElements([
          //     // 'toolbarGroup-View',
          //     'toolbarGroup-Annotate',
          //     'toolbarGroup-Shapes',
          //     'toolbarGroup-Edit',
          //     'toolbarGroup-Insert',
          //     'toolbarGroup-Forms',
          //     'toolbarGroup-FillAndSign',
          //     // 'toolbarGroup-Redact',
          //     'menuButton',
          //     'downloadButton',
          //     'searchButton',
          //     'viewControlsButton',
          //     // 'leftPanelButton',
          //     'contextMenuPopup',
          // ]);
          // UI.enableFeatures([UI.Feature.Redaction]);
          // UI.setToolbarGroup(UI.ToolbarGroup.VIEW);

          // //  ✅ Crop PDF Code
          // UI.disableElements([
          //     // 'toolbarGroup-View',
          //     'toolbarGroup-Annotate',
          //     'toolbarGroup-Shapes',
          //     // 'toolbarGroup-Edit',
          //     'toolbarGroup-Insert',
          //     'toolbarGroup-Forms',
          //     'toolbarGroup-FillAndSign',
          //     // 'toolbarGroup-Redact',
          //     'menuButton',
          //     'downloadButton',
          //     'searchButton',
          //     'viewControlsButton',
          //     // 'leftPanelButton',
          //     'contextMenuPopup',
          // ]);
          // UI.enableElements(['cropButton']);
          // UI.setToolbarGroup(UI.ToolbarGroup.VIEW);

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

          UI.openElements(['leftPanel']);
          UI.openElements(['thumbnailsPanel']);
          // Hide multi-page input bar
          UI.disableElements(['multiPageTab']);

          // // Make sure watermark is available
          // UI.enableElements(['watermarkButton']);
          // // Switch to EDIT toolbar (where watermark lives)
          // UI.setToolbarGroup(UI.ToolbarGroup.EDIT);
          // // Open the watermark dialog directly
          // UI.openElements(['watermarkPanel']);

          // Force single-page selection only
          // const thumbnailControl = documentViewer.getThumbnailControl();
          // if (thumbnailControl) {
          //     thumbnailControl.on('thumbnailSelected', (selectedPages) => {
          //         if (selectedPages.length > 1) {
          //             const lastPage = selectedPages[selectedPages.length - 1];
          //             thumbnailControl.clearSelectedThumbnails();
          //             thumbnailControl.selectThumbnail(lastPage);
          //         }
          //     });
          // }
        });
      });
    });
  }, [pathname]);

  const handleDownload = async () => {
    const instance = instanceRef.current;

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

    setScreenType('download');

    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'downloaded-document.pdf';
    // link.click();
  };

  console.log('uploadedFiles', uploadedFiles);

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
            Combine PDFs in the order you want with the easiest PDF merger available.
          </p>
          {uploadedFiles.length < 2 && (
            <p className='mt-5 text-center text-sm text-white/80'>Select at least 2 PDF files to merge</p>
          )}
        </ActionSidebar>
      </div>
    </>
  );
}
