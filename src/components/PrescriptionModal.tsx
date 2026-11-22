import React, { useRef, useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { PrescriptionRecord } from '../types';

interface PrescriptionModalProps {
  isOpen: boolean;
  prescription: PrescriptionRecord | null;
  onClose: () => void;
  onUploadPrescription: (record: PrescriptionRecord) => void;
  onRemovePrescription: () => void;
  onContinueToCart?: () => void;
}

const SAMPLE_RX_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
  <rect width="600" height="420" fill="#ffffff"/>
  <rect x="20" y="20" width="560" height="380" rx="8" fill="#F8F9FA" stroke="#D1D5DB" stroke-width="2"/>
  <text x="45" y="65" font-family="sans-serif" font-size="20" font-weight="bold" fill="#212121">Dr. Arvind Kulkarni, MBBS, MD</text>
  <text x="45" y="88" font-family="sans-serif" font-size="13" fill="#757575">Reg No: KMC-78412 · Bengaluru Clinic</text>
  <line x1="45" y1="108" x2="555" y2="108" stroke="#E5E7EB" stroke-width="2"/>
  <text x="45" y="148" font-family="serif" font-size="32" font-weight="bold" fill="#FF6F61">Rx</text>
  <text x="45" y="190" font-family="sans-serif" font-size="16" font-weight="bold" fill="#212121">1. Tab. Augmentin 625 Duo — 1 tab BD x 5 days</text>
  <text x="45" y="225" font-family="sans-serif" font-size="16" font-weight="bold" fill="#212121">2. Cap. Pan-D PR — 1 cap before breakfast x 10 days</text>
  <text x="45" y="260" font-family="sans-serif" font-size="16" font-weight="bold" fill="#212121">3. Tab. Allegra 120mg — 1 tab OD at night x 5 days</text>
  <line x1="45" y1="320" x2="555" y2="320" stroke="#E5E7EB" stroke-width="1.5"/>
  <text x="45" y="355" font-family="sans-serif" font-size="13" fill="#1AAB2A" font-weight="bold">Valid Digital Prescription · Signed</text>
</svg>
`)}`;

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  prescription,
  onClose,
  onUploadPrescription,
  onRemovePrescription,
  onContinueToCart,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl =
        typeof reader.result === 'string' ? reader.result : SAMPLE_RX_SVG;
      const newRecord: PrescriptionRecord = {
        id: `rx-${Date.now()}`,
        fileName: file.name,
        fileType: file.type || 'image/jpeg',
        previewUrl,
        uploadedAt: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Pending Verification',
        pharmacistNote: 'Queued for licensed pharmacist review...',
      };
      onUploadPrescription(newRecord);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUseSampleRx = () => {
    onUploadPrescription({
      id: `rx-${Date.now()}`,
      fileName: 'Dr_Kulkarni_Prescription.svg',
      fileType: 'image/svg+xml',
      previewUrl: SAMPLE_RX_SVG,
      uploadedAt: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Pending Verification',
      pharmacistNote: 'Queued for licensed pharmacist review...',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rx-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECEF]">
          <div>
            <h2
              id="rx-modal-title"
              className="font-display text-lg font-bold text-[#212121]"
            >
              Upload Doctor&apos;s Prescription
            </h2>
            <p className="text-xs text-[#757575]">
              Required for Rx medicines · Verified by licensed 1mg pharmacists
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close prescription upload modal"
            className="p-2 rounded-lg text-[#757575] hover:text-[#212121] hover:bg-[#F8F9FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {!prescription ? (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-[#FF6F61] bg-[#FF6F61]/5'
                    : 'border-[#D1D5DB] bg-[#F8F9FA]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6F61]/10 text-[#FF6F61] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#212121]">
                  Drag &amp; drop your prescription image or PDF here
                </p>
                <p className="text-xs text-[#757575] mt-1 mb-4">
                  Supports JPG, PNG, SVG, or PDF up to 10 MB
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-xs font-semibold transition-colors"
                  >
                    Browse File
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSampleRx}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-[#F1F3F5] border border-[#D1D5DB] text-[#212121] text-xs font-semibold transition-colors"
                  >
                    Use Sample Rx
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#757575]">
                <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E8ECEF]">
                  <p className="font-semibold text-[#212121] mb-0.5">1. Clear Photo</p>
                  Ensure doctor name, date &amp; medicine names are legible.
                </div>
                <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E8ECEF]">
                  <p className="font-semibold text-[#212121] mb-0.5">2. Instant Review</p>
                  Pharmacist verifies dosage &amp; validity within minutes.
                </div>
                <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E8ECEF]">
                  <p className="font-semibold text-[#212121] mb-0.5">3. Secure Storage</p>
                  Encrypted &amp; saved safely for your future refills.
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              {/* Preview + Verification Status */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                <div className="sm:col-span-6 rounded-xl border border-[#E8ECEF] bg-[#F8F9FA] overflow-hidden">
                  {prescription.fileType.includes('pdf') ? (
                    <div className="h-52 flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="w-10 h-10 text-[#FF6F61] mb-2" />
                      <p className="text-sm font-semibold text-[#212121] break-all">
                        {prescription.fileName}
                      </p>
                      <p className="text-xs text-[#757575] mt-1">PDF Document Attached</p>
                    </div>
                  ) : (
                    <img
                      src={prescription.previewUrl}
                      alt="Uploaded prescription preview"
                      className="w-full h-56 object-contain bg-white p-2"
                    />
                  )}
                </div>

                <div className="sm:col-span-6 space-y-4">
                  <div>
                    <p className="text-xs text-[#757575]">Uploaded File</p>
                    <p className="text-sm font-semibold text-[#212121] truncate">
                      {prescription.fileName}
                    </p>
                    <p className="text-xs text-[#757575] mt-0.5">
                      Uploaded at {prescription.uploadedAt}
                    </p>
                  </div>

                  {/* Simulated Pharmacist Verification Steps */}
                  <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#212121]">
                        Verification Status
                      </span>
                      {prescription.status === 'Verified by Pharmacist' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1AAB2A]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706]">
                          <Clock className="w-3.5 h-3.5" />
                          {prescription.status}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#1AAB2A] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Prescription received</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 font-medium ${
                          prescription.status === 'Pending Verification'
                            ? 'text-[#757575]'
                            : 'text-[#1AAB2A]'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>Pharmacist reviewing medicine &amp; dosage</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 font-medium ${
                          prescription.status === 'Verified by Pharmacist'
                            ? 'text-[#1AAB2A]'
                            : 'text-[#757575]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Approved for dispatch (RPh #KA-48219)</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#757575] pt-2 border-t border-[#E8ECEF]">
                      {prescription.pharmacistNote}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onContinueToCart) {
                          onContinueToCart();
                        } else {
                          onClose();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      Attach Rx &amp; Continue
                    </button>
                    <button
                      type="button"
                      onClick={onRemovePrescription}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] text-xs font-medium text-[#757575] hover:text-[#DC2626] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
