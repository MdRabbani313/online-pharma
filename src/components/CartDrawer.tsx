import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShieldAlert,
  CheckCircle2,
  Truck,
  FlaskConical,
  ArrowRight,
  ShoppingBag,
  FileUp,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { COUPONS } from '../data/mockData';
import {
  CartItem,
  LocationOption,
  OrderConfirmation,
  PrescriptionRecord,
} from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  location: LocationOption;
  prescription: PrescriptionRecord | null;
  appliedCouponCode: string | null;
  onClose: () => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onApplyCoupon: (code: string | null) => { ok: boolean; message: string };
  onOpenRxModal: () => void;
  onOrderPlaced: (order: OrderConfirmation) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  location,
  prescription,
  appliedCouponCode,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onApplyCoupon,
  onOpenRxModal,
  onOrderPlaced,
}) => {
  const [couponInput, setCouponInput] = useState(appliedCouponCode || '');
  const [couponFeedback, setCouponFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [addressLine, setAddressLine] = useState(
    'Flat 402, Indiranagar 100ft Road, HAL 2nd Stage'
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI (GPay / PhonePe)' | 'Credit / Debit Card' | 'Cash on Delivery'
  >('UPI (GPay / PhonePe)');
  const [confirmedOrder, setConfirmedOrder] =
    useState<OrderConfirmation | null>(null);

  if (!isOpen) return null;

  const hasRxItems = items.some((item) => item.rxRequired);
  const hasLabTests = items.some((item) => item.itemType === 'lab');
  const rxGateBlocked = hasRxItems && !prescription;

  const itemTotalMrp = items.reduce(
    (sum, item) => sum + item.mrp * item.quantity,
    0
  );
  const subtotalAfterProductDiscount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const productDiscount = Math.max(0, itemTotalMrp - subtotalAfterProductDiscount);

  const activeCoupon = COUPONS.find((c) => c.code === appliedCouponCode) || null;
  let couponDiscount = 0;
  if (
    activeCoupon &&
    subtotalAfterProductDiscount >= activeCoupon.minOrderValue
  ) {
    couponDiscount = Math.min(
      activeCoupon.maxDiscount,
      (subtotalAfterProductDiscount * activeCoupon.discountPercent) / 100
    );
  }

  const afterCoupons = Math.max(0, subtotalAfterProductDiscount - couponDiscount);
  const deliveryFee = items.length === 0 ? 0 : afterCoupons >= 499 ? 0 : 49;
  const toPay = afterCoupons + deliveryFee;
  const totalSavings = productDiscount + couponDiscount;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onApplyCoupon(couponInput.trim().toUpperCase());
    setCouponFeedback(res);
  };

  const handleQuickApply = (code: string) => {
    setCouponInput(code);
    const res = onApplyCoupon(code);
    setCouponFeedback(res);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxGateBlocked || items.length === 0) return;

    const order: OrderConfirmation = {
      orderId: `1MG-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...items],
      itemTotalMrp,
      productDiscount,
      couponCode: couponDiscount > 0 && activeCoupon ? activeCoupon.code : null,
      couponDiscount,
      deliveryFee,
      toPay,
      address: `${addressLine}, ${location.city} - ${location.pincode}`,
      paymentMethod,
      estimatedDelivery: location.deliveryEta,
      labVisitSlot: hasLabTests ? 'Tomorrow, 7:00 AM - 8:00 AM' : null,
      hasRx: hasRxItems,
      hasLabTests,
      placedAt: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setConfirmedOrder(order);
    setStep('confirmed');
    onOrderPlaced(order);
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECEF] shrink-0">
          <div>
            <h2 className="font-display text-lg font-bold text-[#212121]">
              {step === 'confirmed'
                ? 'Order Confirmed'
                : step === 'checkout'
                  ? 'Delivery & Payment'
                  : `Your Cart (${items.reduce((s, i) => s + i.quantity, 0)})`}
            </h2>
            {step !== 'confirmed' && (
              <p className="text-xs text-[#757575]">
                Delivering to {location.city} - {location.pincode}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close cart drawer"
            className="p-2 rounded-lg text-[#757575] hover:text-[#212121] hover:bg-[#F8F9FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {step === 'confirmed' && confirmedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-5 rounded-xl bg-[#1AAB2A]/8 border border-[#1AAB2A]/25 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#1AAB2A] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-[#1AAB2A]">
                Order #{confirmedOrder.orderId} Placed Successfully
              </p>
              <h3 className="font-display text-xl font-bold text-[#212121]">
                {confirmedOrder.estimatedDelivery}
              </h3>
              <p className="text-xs text-[#757575]">
                Paid ₹{confirmedOrder.toPay.toFixed(2)} via {confirmedOrder.paymentMethod}
              </p>
            </div>

            {confirmedOrder.labVisitSlot && (
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF] flex items-start gap-3">
                <FlaskConical className="w-5 h-5 text-[#1AAB2A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#212121]">
                    Lab Sample Pickup Scheduled
                  </p>
                  <p className="text-xs text-[#757575] mt-0.5">
                    NABL Phlebotomist slot: <strong>{confirmedOrder.labVisitSlot}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF] space-y-2">
              <div className="flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-[#FF6F61] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#212121]">Delivery Address</p>
                  <p className="text-[#757575] mt-0.5">{confirmedOrder.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#757575]">Order Summary</p>
              <div className="divide-y divide-[#E8ECEF] border border-[#E8ECEF] rounded-xl bg-white">
                {confirmedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[#212121] truncate">
                        {item.title}
                      </p>
                      <p className="text-[#757575]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#212121] tabular-nums shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F9FA] border border-[#E8ECEF] flex items-center justify-center text-[#757575] mb-4">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-display text-base font-bold text-[#212121]">
              Your cart is empty
            </h3>
            <p className="text-xs text-[#757575] max-w-xs mt-1.5 mb-6">
              Add genuine medicines, wellness supplements, or NABL-certified lab checkup packages to get started.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-xs font-bold transition-colors"
            >
              Browse Medicines &amp; Tests
            </button>
          </div>
        ) : step === 'checkout' ? (
          <form
            onSubmit={handlePlaceOrder}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Address */}
              <div className="space-y-2">
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-bold text-[#212121]"
                >
                  Delivery / Sample Pickup Address
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] p-3 text-xs text-[#212121] focus:border-[#FF6F61] focus:outline-none"
                />
                <p className="text-[11px] text-[#757575]">
                  Pin: {location.city} - {location.pincode} · {location.deliveryEta}
                </p>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#212121]">Payment Method</p>
                <div className="space-y-2">
                  {(
                    [
                      'UPI (GPay / PhonePe)',
                      'Credit / Debit Card',
                      'Cash on Delivery',
                    ] as const
                  ).map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'border-[#FF6F61] bg-[#FF6F61]/5'
                          : 'border-[#E8ECEF] bg-[#F8F9FA]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 text-xs font-semibold text-[#212121]">
                        <CreditCard className="w-4 h-4 text-[#757575]" />
                        {method}
                      </span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-[#FF6F61]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Final Amount Summary */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF] space-y-2 text-xs">
                <div className="flex justify-between text-[#757575]">
                  <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span className="tabular-nums">₹{subtotalAfterProductDiscount.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#1AAB2A] font-medium">
                    <span>Coupon ({activeCoupon?.code})</span>
                    <span className="tabular-nums">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#757575]">
                  <span>Packaging &amp; Delivery</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E8ECEF] text-sm font-bold text-[#212121]">
                  <span>Total Payable</span>
                  <span className="tabular-nums">₹{toPay.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#E8ECEF] bg-white space-y-2.5 shrink-0">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors"
              >
                Place Order · ₹{toPay.toFixed(2)}
              </button>
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full py-2 text-xs font-semibold text-[#757575] hover:text-[#212121]"
              >
                Back to Cart
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Scrollable Cart Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Free Delivery Progress */}
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F8F9FA] border border-[#E8ECEF] text-xs">
                <Truck className="w-4 h-4 text-[#1AAB2A] shrink-0" />
                {deliveryFee === 0 ? (
                  <span className="text-[#1AAB2A] font-semibold">
                    Free doorstep delivery unlocked · {location.deliveryEta}
                  </span>
                ) : (
                  <span className="text-[#424242]">
                    Add <strong>₹{(499 - afterCoupons).toFixed(0)}</strong> more for FREE delivery
                  </span>
                )}
              </div>

              {/* Rx Requirement Alert / Verification */}
              {hasRxItems && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    prescription
                      ? 'bg-[#1AAB2A]/8 border-[#1AAB2A]/25'
                      : 'bg-[#FFFBEB] border-[#FDE68A]'
                  }`}
                >
                  {prescription ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[#1AAB2A] font-semibold min-w-0">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          Rx Attached: {prescription.fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenRxModal}
                        className="text-[#212121] underline font-semibold shrink-0"
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-2 text-[#92400E]">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
                        <div>
                          <p className="font-bold">Prescription Required for Checkout</p>
                          <p className="mt-0.5">
                            Your cart includes Rx-only medicines. Upload a valid prescription before proceeding.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenRxModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white font-semibold transition-colors"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        Upload Prescription Now
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Cart Items List */}
              <div className="divide-y divide-[#E8ECEF] border border-[#E8ECEF] rounded-xl bg-white">
                {items.map((item) => (
                  <div key={item.id} className="p-3.5 flex gap-3 items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-[#757575]">
                        <span>
                          {item.itemType === 'lab' ? 'Lab Package' : item.manufacturerOrLab}
                        </span>
                        {item.rxRequired && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#B45309]">Rx</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-[#212121] truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#757575] truncate">{item.subtitle}</p>

                      <div className="flex items-center justify-between gap-2 mt-2.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-[#212121] tabular-nums">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-[11px] text-[#757575] line-through tabular-nums">
                            ₹{(item.mrp * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center rounded-md border border-[#E5E7EB] bg-[#F8F9FA]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.title}`}
                              className="w-7 h-7 flex items-center justify-center text-[#212121] hover:bg-[#EAECEF]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.title}`}
                              className="w-7 h-7 flex items-center justify-center text-[#212121] hover:bg-[#EAECEF]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label={`Remove ${item.title}`}
                            className="p-1.5 text-[#757575] hover:text-[#DC2626] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#212121]">
                    <Tag className="w-3.5 h-3.5 text-[#FF6F61]" />
                    Apply Coupon
                  </span>
                  {activeCoupon && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyCoupon(null);
                        setCouponInput('');
                        setCouponFeedback(null);
                      }}
                      className="text-[11px] font-semibold text-[#DC2626] hover:underline"
                    >
                      Remove ({activeCoupon.code})
                    </button>
                  )}
                </div>

                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. FIRST20)"
                    className="flex-1 h-9 px-3 rounded-lg bg-white border border-[#D1D5DB] text-xs font-mono uppercase text-[#212121] focus:border-[#FF6F61] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 h-9 rounded-lg bg-[#212121] hover:bg-[#333333] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>

                {couponFeedback && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponFeedback.ok ? 'text-[#1AAB2A]' : 'text-[#DC2626]'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COUPONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleQuickApply(c.code)}
                      className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors ${
                        appliedCouponCode === c.code
                          ? 'border-[#1AAB2A] bg-[#1AAB2A]/10 text-[#1AAB2A] font-semibold'
                          : 'border-[#D1D5DB] bg-white text-[#424242] hover:border-[#FF6F61]'
                      }`}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Bill Summary */}
              <div className="p-4 rounded-xl bg-white border border-[#E8ECEF] space-y-2 text-xs">
                <p className="font-display text-sm font-bold text-[#212121] pb-1">
                  Bill Summary
                </p>
                <div className="flex justify-between text-[#757575]">
                  <span>Item Total (MRP)</span>
                  <span className="tabular-nums">₹{itemTotalMrp.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1AAB2A]">
                  <span>Product Discount</span>
                  <span className="tabular-nums">-₹{productDiscount.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#1AAB2A] font-medium">
                    <span>Coupon Savings ({activeCoupon?.code})</span>
                    <span className="tabular-nums">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#757575]">
                  <span>Packaging &amp; Delivery Fee</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-[#1AAB2A] font-semibold">FREE</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-[#E8ECEF] text-sm font-bold text-[#212121]">
                  <span>To Pay</span>
                  <span className="tabular-nums">₹{toPay.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <p className="text-[11px] font-semibold text-[#1AAB2A] pt-1">
                    You save ₹{totalSavings.toFixed(2)} on this order
                  </p>
                )}
              </div>
            </div>

            {/* Sticky Footer Checkout Button */}
            <div className="p-5 border-t border-[#E8ECEF] bg-white shrink-0">
              {rxGateBlocked ? (
                <button
                  type="button"
                  onClick={onOpenRxModal}
                  className="w-full py-3 rounded-lg bg-[#212121] hover:bg-[#333333] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Attach Prescription to Checkout</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout · ₹{toPay.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
