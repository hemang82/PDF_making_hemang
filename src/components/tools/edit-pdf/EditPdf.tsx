'use client';

import Webviewer from '@compdfkit_pdf_sdk/webviewer';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type JSX } from 'react';

export default function EditPdf(): JSX.Element {
  const pathname = usePathname();
  const viewer = useRef(null);

  useEffect(() => {
    Webviewer.init(
      {
        path: '/',
        pdfUrl: '',
        license: process.env.NEXT_PUBLIC_COMPDF_LICENSE_KEY || '',
      },
      viewer.current
    ).then((instance: any) => {
      const { UI } = instance;

      const allTools = [
        'toolMenu-View',
        'toolMenu-Annotation',
        'toolMenu-Form',
        'toolMenu-Sign',
        'toolMenu-Security',
        'toolMenu-Redaction',
        'toolMenu-Compare',
        'toolMenu-Editor',
        'toolMenu-Document',
        'toolMenu-Measurement',
        'toolMenu-Separation',
      ];

      // Hide all first
      UI.disableElements(allTools);
      if (pathname === '/tools/redact-pdf') {
        UI.enableElements(['toolMenu-View', 'toolMenu-Redaction']);
      } else if (pathname === '/tools/compare-pdf') {
        UI.enableElements(['toolMenu-View', 'toolMenu-Compare']);
      } else if (pathname === '/tools/sign-pdf') {
        UI.enableElements(['toolMenu-View', 'toolMenu-Sign']);
      } else {
        // edit, sign, crop, watermark
        UI.enableElements(['toolMenu-View', 'toolMenu-Annotation', 'toolMenu-Editor']);
      }

      instance.docViewer.addEvent('documentloaded', () => {
        console.log('ComPDFKit Web Demo loaded');
      });
    });
  }, [pathname]);

  return <div id='webviewer' ref={viewer} style={{ height: 'calc(100vh - 150px)', overflow: 'hidden' }}></div>;
}
