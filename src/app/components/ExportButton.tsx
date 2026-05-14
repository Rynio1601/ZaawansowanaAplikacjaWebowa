import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  label?: string;
}

export default function ExportButton({ onExportPDF, onExportExcel, label = 'Eksportuj' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <button
              onClick={() => {
                onExportPDF();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <FileText className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Eksportuj do PDF</span>
            </button>
            <button
              onClick={() => {
                onExportExcel();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Eksportuj do Excel</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
