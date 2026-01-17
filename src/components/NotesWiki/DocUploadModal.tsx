import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileUp } from 'lucide-react';

interface DocUploadModalProps {
  showDocUpload: boolean;
  setShowDocUpload: (show: boolean) => void;
  handleDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  processingDoc: boolean;
  processingProgress: number;
}

export default function DocUploadModal({
  showDocUpload,
  setShowDocUpload,
  handleDocumentUpload,
  processingDoc,
  processingProgress,
}: DocUploadModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  if (!showDocUpload) return null;

  const handleClose = () => {
    if (processingDoc) return;
    setIsClosing(true);
    setTimeout(() => {
      setShowDocUpload(false);
      setIsClosing(false);
    }, 300);
  };

  const modal = (
    <div 
      className={`fixed inset-0 modal-overlay backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
      style={{ height: '100dvh' }}
    >
      <div 
        className={`bg-white rounded-lg w-full max-w-md p-4 sm:p-6 modal-content transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-base sm:text-lg text-gray-900 flex items-center gap-2">
            <FileUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            <span className="hidden sm:inline">Tạo ghi chú từ File</span>
            <span className="sm:hidden">Từ File</span>
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-smooth flex-shrink-0 disabled:opacity-50"
            disabled={processingDoc}
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
            <p className="text-gray-700 mb-2 font-medium">📄 Hỗ trợ:</p>
            <ul className="text-gray-600 space-y-1 ml-4">
              <li>• Tệp văn bản (.txt)</li>
              <li>• Tài liệu Word (.doc, .docx)</li>
              <li>• Trích xuất nội dung cơ bản</li>
            </ul>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm text-gray-700 mb-2">
              Chọn file tài liệu
            </label>
            <div className="relative">
              <input
                type="file"
                id="document-upload"
                accept=".doc,.docx,.txt"
                onChange={handleDocumentUpload}
                className="hidden"
                disabled={processingDoc}
              />
              <label
                htmlFor="document-upload"
                className={`flex flex-col items-center justify-center gap-2 sm:gap-3 w-full p-6 sm:p-8 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-smooth ${
                  processingDoc ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {processingDoc ? (
                  <>
                    <FileUp className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-pulse" />
                    <div className="text-center w-full">
                      <p className="text-sm sm:text-base text-gray-900 font-semibold mb-2">
                        Đang xử lý...
                      </p>
                      <p className="text-xs sm:text-sm text-blue-600 mb-3 font-medium">
                        {processingProgress < 30 && '📂 Reading file...'}
                        {processingProgress >= 30 && processingProgress < 60 && '🔍 Extracting text...'}
                        {processingProgress >= 60 && processingProgress < 85 && '✏️ Formatting...'}
                        {processingProgress >= 85 && processingProgress < 95 && '🤖 AI Summary...'}
                        {processingProgress >= 95 && '✅ Finalizing...'}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${processingProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {processingProgress}% hoàn thành
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FileUp className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                    <div className="text-center">
                      <p className="text-sm sm:text-base text-gray-900 mb-1 font-semibold">
                        Nhấn để chọn file
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Hỗ trợ DOC, DOCX, TXT
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}