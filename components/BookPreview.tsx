'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = "//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

export function BookPreview({ filePath }: { filePath: string }) {
  const [numPages, setNumPages] = useState(0);
  const previewPages = Math.min(numPages, 5);

  return (
    <Document
      file={filePath}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      {Array.from({ length: previewPages }, (_, idx) => (
        <Page key={idx} pageNumber={idx + 1} />
      ))}
    </Document>
  );
}
