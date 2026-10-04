import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, UploadCloud, X, ShieldAlert, ArrowLeft, AlertCircle, FileCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { scanImage } from '../services/api';
import { ScanProgress } from '../components/ScanProgress';
import { PrivacyNotice } from '../components/PrivacyNotice';

export const ImageScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAnalyzing, setAnalyzing, setCurrentScan, addScanToHistory } = useAppStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload an image in PNG, JPG, JPEG, or WEBP format.');
      return;
    }

    // Limit to 8MB
    if (file.size > 8 * 1024 * 1024) {
      setError('Image file size must be less than 8MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select or drag an image first.');
      return;
    }

    setError(null);
    setAnalyzing(true, 1);

    try {
      const result = await scanImage(selectedFile);
      result.imageUrl = previewUrl || undefined;
      setCurrentScan(result);
      addScanToHistory(result);

      setTimeout(() => {
        setAnalyzing(false);
        navigate(`/results/${result.id}`);
      }, 2400);
    } catch {
      setAnalyzing(false);
      setError('OCR analysis failed. Please try another image or paste text directly.');
    }
  };

  // Sample screenshot simulation
  const handleLoadSample = () => {
    // Create simulated file
    const sampleBlob = new Blob(['sample-img'], { type: 'image/png' });
    const sampleFile = new File([sampleBlob], 'whatsapp_trading_scam_chat.png', { type: 'image/png' });
    handleFileSelect(sampleFile);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <ScanProgress />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/scan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scan Hub</span>
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-cyan-600" />
            <span>Analyze Screenshot or Chat Image</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload WhatsApp chat screenshots, trading app deposit screens, or advertisement banners for optical character recognition (OCR) and signal extraction.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-cyan-500 bg-cyan-50/50'
                : 'border-slate-300 hover:border-cyan-500 hover:bg-slate-50/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Click to upload or drag & drop screenshot
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, JPEG, WEBP (up to 8MB)
            </p>

            <div className="mt-6 inline-flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSample();
                }}
                className="text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Use Sample Chat Screenshot
              </button>
            </div>
          </div>
        ) : (
          /* Preview Box */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">{selectedFile.name}</div>
                  <div className="text-xs text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewUrl && (
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900/5 max-h-80 flex items-center justify-center p-2">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-h-72 object-contain rounded-lg shadow-sm"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition-all hover:scale-[1.02] active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Run OCR & Scan Screenshot</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <PrivacyNotice />
    </div>
  );
};
