import React from 'react';
import { Download, ChevronDown } from 'lucide-react';

interface FloatingExportButtonProps {
  onExport?: () => void;
}

export const FloatingExportButton: React.FC<FloatingExportButtonProps> = ({ onExport }) => {
  return (
    <div className="fixed bottom-6 right-8 z-40">
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-5 py-3 bg-[#25A9A1] hover:bg-[#1f8c85] text-white font-bold text-xs rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Export Data</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
