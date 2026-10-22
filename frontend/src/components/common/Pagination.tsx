import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  isLoading = false,
}) => {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  const [jumpPage, setJumpPage] = useState('');

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('....');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPage('');
    }
  };

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const FirstIcon = isRtl ? ChevronsRight : ChevronsLeft;
  const LastIcon = isRtl ? ChevronsLeft : ChevronsRight;

  return (
    <div className="mt-10 pt-6 border-t border-gray-800/80">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-800/80 p-4 sm:p-5 shadow-xl">
        {/* Total info badge */}
        <div className="text-xs sm:text-sm text-gray-400 font-medium text-center lg:text-start">
          <span>{t('showing')} </span>
          <span className="text-white font-bold">{startItem.toLocaleString()}</span>
          <span> - </span>
          <span className="text-white font-bold">{endItem.toLocaleString()}</span>
          <span> {t('pageOf')} </span>
          <span className="text-red-400 font-bold">{totalCount.toLocaleString()}</span>
          <span> {t('moviesCount')} </span>
          <span className="text-gray-500 text-xs">
            ({t('page')} {currentPage} {t('pageOf')} {totalPages})
          </span>
        </div>

        {/* Page navigation controls */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || isLoading}
            className={`p-2 rounded-xl border border-gray-700/60 transition-all duration-200 ${
              currentPage === 1 || isLoading
                ? 'opacity-30 cursor-not-allowed bg-gray-800/40 text-gray-500'
                : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-600'
            }`}
            title={t('firstPage')}
            aria-label={t('firstPage')}
          >
            <FirstIcon className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-700/60 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              currentPage === 1 || isLoading
                ? 'opacity-30 cursor-not-allowed bg-gray-800/40 text-gray-500'
                : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-600'
            }`}
            aria-label={t('previous')}
          >
            <PrevIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{t('previous')}</span>
          </button>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {getPageNumbers().map((item, idx) => {
              if (typeof item === 'string') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-gray-500 text-xs sm:text-sm font-bold select-none"
                  >
                    •••
                  </span>
                );
              }

              const isActive = item === currentPage;
              return (
                <button
                  key={`page-${item}`}
                  onClick={() => onPageChange(item)}
                  disabled={isLoading}
                  className={`min-w-[34px] sm:min-w-[40px] h-[34px] sm:h-[40px] px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-900/40 ring-2 ring-red-500/40 scale-105'
                      : 'bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700/60 hover:border-gray-600'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-700/60 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              currentPage === totalPages || isLoading
                ? 'opacity-30 cursor-not-allowed bg-gray-800/40 text-gray-500'
                : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-600'
            }`}
            aria-label={t('next')}
          >
            <span className="hidden sm:inline">{t('next')}</span>
            <NextIcon className="w-4 h-4" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            className={`p-2 rounded-xl border border-gray-700/60 transition-all duration-200 ${
              currentPage === totalPages || isLoading
                ? 'opacity-30 cursor-not-allowed bg-gray-800/40 text-gray-500'
                : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-600'
            }`}
            title={t('lastPage')}
            aria-label={t('lastPage')}
          >
            <LastIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Direct page jump */}
        <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            placeholder={String(currentPage)}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            disabled={isLoading}
            className="w-16 sm:w-20 bg-gray-900 text-white text-center text-xs sm:text-sm px-2 py-2 rounded-xl border border-gray-700/80 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            title={`${t('goToPage')} (1 - ${totalPages})`}
          />
          <button
            type="submit"
            disabled={!jumpPage || isLoading}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 ${
              !jumpPage || isLoading
                ? 'opacity-30 cursor-not-allowed bg-gray-800/40 border-gray-700/40 text-gray-500'
                : 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-md shadow-red-900/30'
            }`}
          >
            {t('go')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pagination;
