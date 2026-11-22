import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { LOCATIONS } from '../data/mockData';
import { LocationOption } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  currentLocation: LocationOption;
  onClose: () => void;
  onSelectLocation: (loc: LocationOption) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  currentLocation,
  onClose,
  onSelectLocation,
}) => {
  const [customPin, setCustomPin] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customPin.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setPinError('Please enter a valid 6-digit Indian pincode.');
      return;
    }
    setPinError('');
    const matched = LOCATIONS.find((l) => l.pincode === cleaned);
    if (matched) {
      onSelectLocation(matched);
    } else {
      onSelectLocation({
        city: 'India Serviceable',
        pincode: cleaned,
        deliveryEta: 'Arriving Tomorrow by 2:00 PM',
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECEF]">
          <h2
            id="location-modal-title"
            className="font-display text-base font-bold text-[#212121]"
          >
            Select Delivery Pincode
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location selector"
            className="p-1.5 rounded-lg text-[#757575] hover:text-[#212121] hover:bg-[#F8F9FA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <form onSubmit={handlePinSubmit} className="space-y-2">
            <label
              htmlFor="custom-pincode"
              className="block text-xs font-semibold text-[#757575]"
            >
              Enter 6-digit pincode
            </label>
            <div className="flex gap-2">
              <input
                id="custom-pincode"
                type="text"
                maxLength={6}
                value={customPin}
                onChange={(e) => {
                  setCustomPin(e.target.value.replace(/\D/g, ''));
                  setPinError('');
                }}
                placeholder="e.g., 560038"
                className="flex-1 h-10 px-3 rounded-lg border border-[#D1D5DB] text-sm font-mono text-[#212121] focus:border-[#FF6F61] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 h-10 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-xs font-bold transition-colors"
              >
                Check
              </button>
            </div>
            {pinError && <p className="text-xs text-[#DC2626]">{pinError}</p>}
          </form>

          <div>
            <p className="text-xs font-semibold text-[#757575] mb-2">
              Popular Cities
            </p>
            <div className="divide-y divide-[#E8ECEF] border border-[#E8ECEF] rounded-xl overflow-hidden">
              {LOCATIONS.map((loc) => {
                const isSelected = loc.pincode === currentLocation.pincode;
                return (
                  <button
                    key={loc.pincode}
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#F8F9FA] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#FF6F61]" />
                      <div>
                        <p className="text-xs font-bold text-[#212121]">
                          {loc.city} - {loc.pincode}
                        </p>
                        <p className="text-[11px] text-[#1AAB2A]">{loc.deliveryEta}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#FF6F61]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
