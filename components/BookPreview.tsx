'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = //unpkg.com/pdfjs-dist@/build/pdf.worker.min.js;

export function BookPreview({ filePath }: { filePath: string }) {
  const [numPages, setNumPages] = useState(0);
  const previewPages = Math.min(numPages, 5);

  return (
    <div className="border border-pink-400 rounded overflow-hidden">
      <Document file={filePath} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from({ length: previewPages }).map((_, i) => (
          <Page key={i} pageNumber={i + 1} width={250} />
        ))}
      </Document>
    </div>
  );
}
