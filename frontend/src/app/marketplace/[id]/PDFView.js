"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { pdfjs } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const Document = dynamic(() => import("react-pdf").then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import("react-pdf").then(mod => mod.Page), { ssr: false });

export default function PDFView({ url }) {
  const [numPages, setNumPages] = useState(null);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from(new Array(numPages), (el, idx) => (
          <Page key={idx} pageNumber={idx + 1} width={600} />
        ))}
      </Document>
    </div>
  );
}
