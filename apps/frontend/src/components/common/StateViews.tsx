import React from 'react';
import { Loader2, AlertTriangle, Inbox } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Memuat data snapshot EduAtlas...',
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <Loader2 className="w-8 h-8 text-[#25A9A1] animate-spin mb-3" />
    <p className="text-sm font-medium text-[#526579]">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  onReset?: () => void;
}> = ({
  title = 'Tidak Ada Data Ditemukan',
  description = 'Tidak ada rekaman data yang cocok dengan kriteria filter saat ini.',
  onReset,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="p-4 bg-gray-50 border border-[#DCE5EF] rounded-full text-[#526579] mb-3">
      <Inbox className="w-8 h-8" />
    </div>
    <h4 className="text-base font-bold text-[#172B4D]">{title}</h4>
    <p className="text-xs text-[#526579] mt-1 max-w-sm">{description}</p>
    {onReset && (
      <button
        onClick={onReset}
        className="mt-4 px-4 py-1.5 text-xs font-semibold bg-[#25A9A1] text-white rounded-lg hover:bg-[#1f8c85] transition-colors"
      >
        Reset Filter
      </button>
    )}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kendala saat menyinkronkan data dari server backend.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="p-4 bg-rose-50 border border-rose-200 rounded-full text-[#C2414B] mb-3">
      <AlertTriangle className="w-8 h-8" />
    </div>
    <h4 className="text-base font-bold text-[#C2414B]">{title}</h4>
    <p className="text-xs text-[#526579] mt-1 max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-1.5 text-xs font-semibold bg-[#153B66] text-white rounded-lg hover:bg-[#0f2d50] transition-colors"
      >
        Coba Lagi
      </button>
    )}
  </div>
);
