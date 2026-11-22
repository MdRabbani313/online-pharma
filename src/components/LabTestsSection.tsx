import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  ShieldCheck,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import { LabTestPackage } from '../types';

interface LabTestsSectionProps {
  labTests: LabTestPackage[];
  cartQuantities: Record<string, number>;
  onBookTest: (test: LabTestPackage) => void;
  onUpdateQty: (id: string, qty: number) => void;
}

export const LabTestsSection: React.FC<LabTestsSectionProps> = ({
  labTests,
  cartQuantities,
  onBookTest,
  onUpdateQty,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -360 : 360;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section
      id="lab-tests-section"
      className="max-w-[1320px] mx-auto px-4 lg:px-8 py-10 border-t border-[#E8ECEF]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-[#1AAB2A] mb-1">
            NABL &amp; ISO Certified Partner Labs · Free Home Sample Collection
          </p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#212121]">
            Lab Tests &amp; Full Body Health Checkups
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            aria-label="Scroll lab packages left"
            className="w-9 h-9 rounded-lg border border-[#E8ECEF] bg-white hover:bg-[#F8F9FA] flex items-center justify-center text-[#212121] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            aria-label="Scroll lab packages right"
            className="w-9 h-9 rounded-lg border border-[#E8ECEF] bg-white hover:bg-[#F8F9FA] flex items-center justify-center text-[#212121] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
      >
        {labTests.map((test) => {
          const qty = cartQuantities[test.id] || 0;
          return (
            <article
              key={test.id}
              className="snap-start flex-none w-[300px] sm:w-[330px] flex flex-col bg-[#F8F9FA] border border-[#E8ECEF] rounded-xl p-5 hover:bg-white hover:shadow-md transition-all duration-150"
            >
              {/* Top Header */}
              <div className="flex items-center justify-between gap-2 text-xs text-[#757575] mb-2">
                <span className="inline-flex items-center gap-1 font-medium text-[#212121]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1AAB2A]" />
                  {test.accreditation}
                </span>
                <span className="font-semibold text-[#FF6F61] tabular-nums">
                  {test.testsCount} Tests
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-[#212121] leading-snug line-clamp-2 min-h-[44px]">
                {test.name}
              </h3>

              <p className="text-xs text-[#757575] mt-1.5 line-clamp-2 min-h-[32px]">
                {test.subtitle}
              </p>

              {/* Key Attributes */}
              <div className="mt-3 pt-3 border-t border-[#E8ECEF] space-y-1.5 text-xs text-[#424242]">
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-[#757575] shrink-0" />
                  <span>Home Sample Pickup · {test.sampleType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#757575] shrink-0" />
                  <span>
                    {test.reportTime} · {test.fastingRequired}
                  </span>
                </div>
              </div>

              {/* Included Tests Preview */}
              <div className="mt-3 text-[11px] text-[#757575] line-clamp-2">
                Includes: {test.includedTests.slice(0, 3).join(', ')}
                {test.includedTests.length > 3 ? ` +${test.includedTests.length - 3} more` : ''}
              </div>

              {/* Pricing + Book Now CTA */}
              <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#757575] line-through tabular-nums">
                      ₹{test.mrp}
                    </span>
                    <span className="font-bold text-[#1AAB2A] tabular-nums">
                      {test.discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[#212121] tabular-nums">
                    ₹{test.price}
                  </p>
                </div>

                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => onBookTest(test)}
                    className="px-4 py-2 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                  >
                    Book Now
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1AAB2A]">
                      <Check className="w-3.5 h-3.5" />
                      Added
                    </span>
                    <div className="inline-flex items-center rounded-lg bg-[#FF6F61] text-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(test.id, qty - 1)}
                        aria-label={`Remove one ${test.name}`}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#E85A4D]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(test.id, qty + 1)}
                        aria-label={`Add another ${test.name}`}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#E85A4D]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
