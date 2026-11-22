import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Info,
  Wine,
  Baby,
  Car,
  Activity,
  Sparkles,
  Star,
} from 'lucide-react';
import { GenericSubstitute, Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  quantity: number;
  substituteQuantities: Record<string, number>;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onAddSubstitute: (substitute: GenericSubstitute, parentProduct: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  quantity,
  substituteQuantities,
  onClose,
  onAddProduct,
  onUpdateQty,
  onAddSubstitute,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (!product) return null;

  const getSafetyIcon = (topic: string) => {
    switch (topic) {
      case 'Alcohol':
        return <Wine className="w-4 h-4 text-[#757575]" />;
      case 'Pregnancy':
        return <Baby className="w-4 h-4 text-[#757575]" />;
      case 'Driving':
        return <Car className="w-4 h-4 text-[#757575]" />;
      default:
        return <Activity className="w-4 h-4 text-[#757575]" />;
    }
  };

  const getSafetyBadge = (status: string) => {
    switch (status) {
      case 'Safe':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1AAB2A]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Safe
          </span>
        );
      case 'Unsafe':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626]">
            <Ban className="w-3.5 h-3.5" />
            Unsafe
          </span>
        );
      case 'Caution':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706]">
            <AlertTriangle className="w-3.5 h-3.5" />
            Caution
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
            <Info className="w-3.5 h-3.5" />
            Consult Doctor
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E8ECEF] bg-white shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#757575] truncate">
              {product.category} · {product.manufacturer}
            </p>
            <h2
              id="product-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-[#212121] truncate"
            >
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-2 rounded-lg text-[#757575] hover:text-[#212121] hover:bg-[#F8F9FA] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Top Overview Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 rounded-xl overflow-hidden bg-[#F8F9FA] border border-[#E8ECEF] aspect-[4/3]">
              {!imgFailed ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#757575] p-6">
                  {product.imageBgLabel}
                </div>
              )}
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#757575]">
                <span className="inline-flex items-center gap-1 font-semibold text-[#1AAB2A]">
                  <Star className="w-3.5 h-3.5 fill-[#1AAB2A]" />
                  {product.rating}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{product.reviewCount.toLocaleString('en-IN')} verified ratings</span>
                <span aria-hidden="true">·</span>
                <span>{product.packSize}</span>
              </div>

              <div>
                <p className="text-xs font-medium text-[#757575]">Salt Composition</p>
                <p className="text-sm font-semibold text-[#212121] mt-0.5">
                  {product.saltComposition}
                </p>
              </div>

              {product.rxRequired && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
                  <span>
                    <strong>Prescription Required:</strong> Please attach a valid doctor&apos;s prescription before completing checkout.
                  </span>
                </div>
              )}

              {/* Contiguous Purchase Module */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF]">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#757575]">MRP</span>
                    <span className="text-[#757575] line-through tabular-nums">
                      ₹{product.mrp.toFixed(2)}
                    </span>
                    <span className="font-bold text-[#1AAB2A] tabular-nums">
                      {product.discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#212121] tabular-nums mt-0.5">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-[#757575] mt-0.5">
                    Inclusive of all taxes · {product.packSize}
                  </p>
                </div>

                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={() => onAddProduct(product)}
                    className="px-6 py-2.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="inline-flex items-center rounded-lg bg-[#FF6F61] text-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.id, quantity - 1)}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#E85A4D]"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.id, quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#E85A4D]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cheaper Generic Substitutes (Signature Tata 1mg feature) */}
          {product.substitutes.length > 0 && (
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-[#212121] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1AAB2A]" />
                    Cheaper Generic Substitutes
                  </h3>
                  <p className="text-xs text-[#757575]">
                    Same salt composition ({product.saltComposition}) · Clinically equivalent alternatives
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#E8ECEF] border border-[#E8ECEF] rounded-xl overflow-hidden bg-white">
                {product.substitutes.map((sub) => {
                  const subQty = substituteQuantities[sub.id] || 0;
                  return (
                    <div
                      key={sub.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-[#F8F9FA] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#212121]">
                            {sub.name}
                          </p>
                          {sub.savingsPercent > 0 && (
                            <span className="text-xs font-semibold text-[#1AAB2A] tabular-nums">
                              Save {sub.savingsPercent}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#757575] mt-0.5">
                          {sub.manufacturer} · {sub.packSize}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-[#212121] tabular-nums">
                            ₹{sub.price.toFixed(2)}
                          </p>
                          <p className="text-[11px] text-[#757575] line-through tabular-nums">
                            ₹{sub.mrp.toFixed(2)}
                          </p>
                        </div>

                        {subQty === 0 ? (
                          <button
                            type="button"
                            onClick={() => onAddSubstitute(sub, product)}
                            className="px-3.5 py-1.5 rounded-lg border border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white text-xs font-semibold transition-colors whitespace-nowrap"
                          >
                            Add Substitute
                          </button>
                        ) : (
                          <div className="inline-flex items-center rounded-lg bg-[#FF6F61] text-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(sub.id, subQty - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#E85A4D]"
                              aria-label={`Decrease ${sub.name}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">
                              {subQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(sub.id, subQty + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#E85A4D]"
                              aria-label={`Increase ${sub.name}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Clinical Information Grid: Uses & Side Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF]">
              <h3 className="font-display text-sm font-bold text-[#212121] mb-3">
                Uses &amp; Therapeutic Benefits
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#424242]">
                {product.uses.map((u, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#1AAB2A] font-bold mt-0.5">•</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF]">
              <h3 className="font-display text-sm font-bold text-[#212121] mb-3">
                Common Side Effects
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#424242]">
                {product.sideEffects.map((se, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#757575] font-bold mt-0.5">•</span>
                    <span>{se}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safety Advice */}
          <section className="space-y-3">
            <h3 className="font-display text-base font-bold text-[#212121]">
              Safety Advice
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.safetyAdvice.map((item) => (
                <div
                  key={item.topic}
                  className="p-4 rounded-xl border border-[#E8ECEF] bg-white space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#212121]">
                      {getSafetyIcon(item.topic)}
                      <span>{item.topic}</span>
                    </div>
                    {getSafetyBadge(item.status)}
                  </div>
                  <p className="text-xs text-[#757575] leading-relaxed">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
