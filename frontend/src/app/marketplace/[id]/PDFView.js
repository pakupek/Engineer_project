"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../Services/auth";


export default function PDFView({ fileUrl }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        const fullUrl = `http://localhost:8000${fileUrl}`;
        
        console.log("Loading PDF from:", fullUrl);
        
        const response = await fetch(fullUrl, {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Błąd HTTP: ${response.status}`);
        }

        const blob = await response.blob();
        console.log("PDF blob received:", blob.size, "bytes");
        
        // Tworzymy Blob URL zamiast przekazywać URL bezpośrednio
        const blobUrl = URL.createObjectURL(blob);
        setPdfFile(blobUrl);
        
      } catch (err) {
        console.error('Błąd ładowania PDF:', err);
        setError('Nie udało się załadować pliku PDF');
      } finally {
        setLoading(false);
      }
    };

    if (fileUrl) {
      loadPdf();
    }

    // Cleanup
    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [fileUrl]);

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{
          border: '3px solid #f3f4f6',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ color: '#6b7280', margin: 0 }}>Ładowanie historii pojazdu...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#ef4444'
      }}>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      width: "100%", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    }}>
      
      {/* Przyciski akcji */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = pdfFile;
            link.download = 'historia_pojazdu.pdf';
            link.click();
          }}
          style={{
            padding: '10px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📄 Pobierz PDF
        </button>
        
        <button
          onClick={() => window.open(pdfFile, '_blank')}
          style={{
            padding: '10px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🔍 Otwórz w nowej karcie
        </button>
      </div>
    </div>
  );
}