import React, { useState } from 'react';
import { X, UserCheck, Package, FileText, LogOut } from 'lucide-react';
import { OrderConfirmation, PrescriptionRecord, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  orders: OrderConfirmation[];
  prescription: PrescriptionRecord | null;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  user,
  orders,
  prescription,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [phone, setPhone] = useState('9880123456');
  const [name, setName] = useState('Aarav Sharma');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('1234');

  if (!isOpen) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpStep(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name.trim() || 'Aarav Sharma',
      phone: `+91 ${phone}`,
      email: 'aarav.sharma@example.in',
    });
    setOtpStep(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECEF]">
          <h2
            id="auth-modal-title"
            className="font-display text-lg font-bold text-[#212121]"
          >
            {user ? 'Your 1mg Profile' : 'Sign In / Sign Up'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="p-1.5 rounded-lg text-[#757575] hover:text-[#212121] hover:bg-[#F8F9FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {user ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF]">
                <div className="w-11 h-11 rounded-full bg-[#FF6F61]/15 text-[#FF6F61] flex items-center justify-center font-display font-bold text-base">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#212121] flex items-center gap-1.5">
                    {user.name}
                    <UserCheck className="w-3.5 h-3.5 text-[#1AAB2A]" />
                  </p>
                  <p className="text-xs text-[#757575]">{user.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#212121] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#757575]" />
                  Saved Prescription
                </p>
                <div className="p-3 rounded-lg border border-[#E8ECEF] text-xs text-[#757575]">
                  {prescription
                    ? `${prescription.fileName} (${prescription.status})`
                    : 'No prescription uploaded yet.'}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#212121] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#757575]" />
                  Recent Orders ({orders.length})
                </p>
                {orders.length === 0 ? (
                  <p className="p-3 rounded-lg border border-[#E8ECEF] text-xs text-[#757575]">
                    No orders placed in this session yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {orders.map((ord) => (
                      <div
                        key={ord.orderId}
                        className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E8ECEF] text-xs flex justify-between"
                      >
                        <div>
                          <p className="font-bold text-[#212121]">#{ord.orderId}</p>
                          <p className="text-[#757575]">{ord.estimatedDelivery}</p>
                        </div>
                        <p className="font-bold text-[#212121] tabular-nums">
                          ₹{ord.toPay.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] text-xs font-semibold text-[#757575] hover:text-[#DC2626] flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : !otpStep ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <p className="text-xs text-[#757575]">
                Access your saved prescriptions, order tracking, and diagnostic smart reports.
              </p>
              <div>
                <label
                  htmlFor="auth-name"
                  className="block text-xs font-semibold text-[#212121] mb-1"
                >
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#D1D5DB] text-sm text-[#212121] focus:border-[#FF6F61] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="auth-phone"
                  className="block text-xs font-semibold text-[#212121] mb-1"
                >
                  Mobile Number (+91)
                </label>
                <input
                  id="auth-phone"
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-10 px-3 rounded-lg border border-[#D1D5DB] text-sm font-mono text-[#212121] focus:border-[#FF6F61] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-[#757575]">
                Enter the 4-digit OTP sent to <strong>+91 {phone}</strong> (Demo OTP: 1234).
              </p>
              <input
                type="text"
                required
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full h-11 px-3 rounded-lg border border-[#D1D5DB] text-center text-lg font-mono tracking-widest text-[#212121] focus:border-[#FF6F61] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors"
              >
                Verify &amp; Continue
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
