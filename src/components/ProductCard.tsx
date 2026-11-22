import React, { useState } from 'react';
import { Plus, Minus, Pill, ShieldAlert } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onUpdateQty: (productId: string, newQty: number) => void;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAdd,
  onUpdateQty,
  onOpenDetail,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="group flex flex-col bg-white border border-[#E8ECEF] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      {/* Clickable Product Image */}
      <button
        type="button"
        onClick={() => onOpenDetail(product)}
        className="relative aspect-[4/3] w-full bg-[#F8F9FA] overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6F61]"
      >
        {!imgFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F8F9FA] to-[#ECEFF1] text-[#757575]">
            <Pill className="w-8 h-8 mb-1.5 text-[#FF6F61]/70" />
            <span className="text-xs font-medium text-center">{product.imageBgLabel}</span>
          </div>
        )}

        {/* Single clean Rx indicator in top-left when required */}
        {product.rxRequired && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 border border-[#E5E7EB] text-[11px] font-semibold text-[#B45309]">
            <ShieldAlert className="w-3 h-3" />
            Rx Required
          </span>
        )}
      </button>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        <button
          type="button"
          onClick={() => onOpenDetail(product)}
          className="text-left focus-visible:outline-none focus-visible:underline"
        >
          <p className="text-[11px] font-medium text-[#757575] truncate">
            {product.manufacturer}
          </p>
          <h3 className="font-display text-base font-semibold text-[#212121] group-hover:text-[#FF6F61] transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h3>
        </button>

        <p className="text-xs text-[#757575] mt-1 line-clamp-1">
          {product.packSize} · {product.saltComposition}
        </p>

        {/* Bottom Price + Add Stepper Row */}
        <div className="mt-auto pt-4 flex items-end justify-between gap-2 border-t border-[#F1F3F5]">
          <div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#757575] line-through tabular-nums">
                ₹{product.mrp.toFixed(2)}
              </span>
              <span className="font-semibold text-[#1AAB2A] tabular-nums">
                {product.discountPercent}% OFF
              </span>
            </div>
            <p className="text-base font-bold text-[#212121] tabular-nums mt-0.5">
              ₹{product.price.toFixed(2)}
            </p>
          </div>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(product)}
              className="px-4 py-2 rounded-lg bg-white hover:bg-[#FF6F61] text-[#FF6F61] hover:text-white border border-[#FF6F61] text-xs font-bold tracking-wide transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
            >
              ADD
            </button>
          ) : (
            <div className="inline-flex items-center rounded-lg bg-[#FF6F61] text-white overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, quantity - 1)}
                aria-label={`Decrease quantity of ${product.name}`}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#E85A4D] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, quantity + 1)}
                aria-label={`Increase quantity of ${product.name}`}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#E85A4D] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
