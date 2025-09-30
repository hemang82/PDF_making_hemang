declare module '@compdfkit_pdf_sdk/webviewer' {
  interface WebviewerConfig {
    path: string;
    pdfUrl: string;
    license: string;
  }

  interface UIInstance {
    disableElements: (elements: string[]) => void;
    enableElements: (elements: string[]) => void;
  }

  interface DocViewer {
    addEvent: (event: string, callback: () => void) => void;
  }

  interface WebviewerInstance {
    UI: UIInstance;
    docViewer: DocViewer;
  }

  const Webviewer: {
    init: (config: WebviewerConfig, element: HTMLElement | null) => Promise<WebviewerInstance>;
  };

  export default Webviewer;
}
