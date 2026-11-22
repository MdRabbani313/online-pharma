import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileUp,
  FlaskConical,
  Stethoscope,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { HERO_BANNERS } from '../data/mockData';
import { PrescriptionRecord } from '../types';

interface HeroSectionProps {
  onBannerAction: (action: 'medicines' | 'labs' | 'consult') => void;
  onApplyBannerCoupon: (code: string) => void;
  onOpenRxModal: () => void;
  onOpenConsultModal: () => void;
  onScrollToLabs: () => void;
  prescription: PrescriptionRecord | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBannerAction,
  onApplyBannerCoupon,
  onOpenRxModal,
  onOpenConsultModal,
  onScrollToLabs,
  prescription,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const currentBanner = HERO_BANNERS[activeSlide];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    onApplyBannerCoupon(code);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="max-w-[1320px] mx-auto px-4 lg:px-8 pt-6 pb-8">
      {/* Promotional Banner Carousel */}
      <div className="relative rounded-xl overflow-hidden bg-[#212121] border border-[#E8ECEF]">
        <div className="relative min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] flex items-center">
          {/* Background Image with Contrast Scrim */}
          {!imgError[currentBanner.id] ? (
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.imageAlt}
              referrerPolicy="no-referrer"
              onError={() =>
                setImgError((prev) => ({ ...prev, [currentBanner.id]: true }))
              }
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B2D42] to-[#1B1D29]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/25" />

          {/* Slide Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-10 lg:px-14 py-10 text-white">
            <p className="text-xs sm:text-sm font-medium text-[#FFB4AC] mb-2.5 tracking-wide">
              {currentBanner.eyebrow}
            </p>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-white [text-wrap:balance] mb-3">
              {currentBanner.headline}
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-xl leading-relaxed mb-6">
              {currentBanner.subtext}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onBannerAction(currentBanner.ctaAction)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{currentBanner.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCopyCoupon(currentBanner.couponCode)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white text-xs sm:text-sm font-mono font-medium transition-colors whitespace-nowrap shrink-0"
              >
                {copiedCode === currentBanner.couponCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5CE070]" />
                    <span>Code {currentBanner.couponCode} applied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Use Code: {currentBanner.couponCode}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prev / Next Arrows */}
          <button
            type="button"
            onClick={() =>
              setActiveSlide(
                (prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length
              )
            }
            aria-label="Previous promotion"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-black/40 hover:bg-black/65 text-white absolute left-3 top-1/2 -translate-y-1/2 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveSlide((prev) => (prev + 1) % HERO_BANNERS.length)
            }
            aria-label="Next promotion"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-black/40 hover:bg-black/65 text-white absolute right-3 top-1/2 -translate-y-1/2 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-6 sm:left-10 lg:left-14 flex items-center gap-2 z-10">
            {HERO_BANNERS.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Show slide ${idx + 1}`}
                className={`h-1.5 rounded-sm transition-all ${
                  idx === activeSlide
                    ? 'w-7 bg-[#FF6F61]'
                    : 'w-2.5 bg-white/45 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3 Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Card 1: Order with Prescription */}
        <button
          type="button"
          onClick={onOpenRxModal}
          className="group flex items-start justify-between gap-4 p-5 rounded-xl bg-[#F8F9FA] hover:bg-white border border-[#E8ECEF] hover:border-[#FF6F61]/50 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#757575]">
              {prescription ? (
                <span className="inline-flex items-center gap-1 text-[#1AAB2A] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {prescription.status}
                </span>
              ) : (
                <span>Pharmacist verified · Fast dispatch</span>
              )}
            </div>
            <h2 className="font-display text-base font-bold text-[#212121] group-hover:text-[#FF6F61] transition-colors">
              Order with Prescription
            </h2>
            <p className="text-xs text-[#757575] leading-relaxed">
              Upload your doctor&apos;s Rx for instant pharmacist verification &amp; doorstep delivery.
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#FF6F61]/10 text-[#FF6F61] flex items-center justify-center shrink-0">
            <FileUp className="w-5 h-5" />
          </div>
        </button>

        {/* Card 2: Book Lab Tests */}
        <button
          type="button"
          onClick={onScrollToLabs}
          className="group flex items-start justify-between gap-4 p-5 rounded-xl bg-[#F8F9FA] hover:bg-white border border-[#E8ECEF] hover:border-[#FF6F61]/50 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
        >
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#1AAB2A]">
              Home Sample Collection · NABL Labs
            </div>
            <h2 className="font-display text-base font-bold text-[#212121] group-hover:text-[#FF6F61] transition-colors">
              Book Lab Tests
            </h2>
            <p className="text-xs text-[#757575] leading-relaxed">
              Full body checkups, Thyroid &amp; HbA1c tests with digital reports in 12–24 hours.
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#1AAB2A]/10 text-[#1AAB2A] flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
        </button>

        {/* Card 3: Consult a Doctor */}
        <button
          type="button"
          onClick={onOpenConsultModal}
          className="group flex items-start justify-between gap-4 p-5 rounded-xl bg-[#F8F9FA] hover:bg-white border border-[#E8ECEF] hover:border-[#FF6F61]/50 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
        >
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-[#757575]">
              Video consult in 15 mins · Free follow-up
            </div>
            <h2 className="font-display text-base font-bold text-[#212121] group-hover:text-[#FF6F61] transition-colors">
              Consult a Doctor
            </h2>
            <p className="text-xs text-[#757575] leading-relaxed">
              Connect with experienced Physicians, Diabetologists &amp; Specialists online.
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#212121]/8 text-[#212121] flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
        </button>
      </div>
    </section>
  );
};
