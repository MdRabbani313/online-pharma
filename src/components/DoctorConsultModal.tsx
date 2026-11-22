import React, { useState } from 'react';
import { X, Star, Video, Clock, CheckCircle2, Stethoscope } from 'lucide-react';
import { DOCTORS } from '../data/mockData';
import { DoctorProfile } from '../types';

interface DoctorConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLOTS = ['Today, 7:30 PM', 'Today, 8:15 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 11:30 AM'];

export const DoctorConsultModal: React.FC<DoctorConsultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>(SLOTS[0]);
  const [patientName, setPatientName] = useState('Aarav Sharma');
  const [symptoms, setSymptoms] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const specialties = ['All', ...Array.from(new Set(DOCTORS.map((d) => d.specialty)))];
  const filteredDoctors =
    selectedSpecialty === 'All'
      ? DOCTORS
      : DOCTORS.filter((d) => d.specialty === selectedSpecialty);

  const handleConfirmConsult = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingId(`CONS-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const resetAndClose = () => {
    setSelectedDoctor(null);
    setBookingId(null);
    setSymptoms('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consult-modal-title"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECEF]">
          <div>
            <h2
              id="consult-modal-title"
              className="font-display text-lg font-bold text-[#212121]"
            >
              Consult Verified Doctors Online
            </h2>
            <p className="text-xs text-[#757575]">
              HD Video consultation · Digital Rx valid at all pharmacies
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close doctor consultation modal"
            className="p-2 rounded-lg text-[#757575] hover:text-[#212121] hover:bg-[#F8F9FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {bookingId && selectedDoctor ? (
            <div className="max-w-md mx-auto py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1AAB2A] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-[#1AAB2A]">
                Consultation Confirmed · #{bookingId}
              </p>
              <h3 className="font-display text-xl font-bold text-[#212121]">
                {selectedDoctor.name} ({selectedDoctor.specialty})
              </h3>
              <p className="text-sm text-[#757575]">
                Video session scheduled for <strong>{selectedSlot}</strong> for{' '}
                <strong>{patientName}</strong>.
              </p>
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF] text-xs text-[#424242]">
                Meeting link &amp; pre-consult checklist sent. Your digital prescription will be added directly to your 1mg account after the call.
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-2.5 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors"
              >
                Done
              </button>
            </div>
          ) : selectedDoctor ? (
            <form onSubmit={handleConfirmConsult} className="space-y-5">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF]">
                <div>
                  <p className="font-display text-base font-bold text-[#212121]">
                    {selectedDoctor.name}
                  </p>
                  <p className="text-xs text-[#757575]">
                    {selectedDoctor.specialty} · {selectedDoctor.qualification}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-[#212121] tabular-nums">
                    ₹{selectedDoctor.fee}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="text-xs font-semibold text-[#FF6F61] hover:underline"
                  >
                    Change Doctor
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[#212121] mb-2">
                  Select Video Slot
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                        selectedSlot === slot
                          ? 'border-[#FF6F61] bg-[#FF6F61]/8 text-[#FF6F61]'
                          : 'border-[#E5E7EB] bg-white text-[#424242] hover:bg-[#F8F9FA]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="consult-patient"
                    className="block text-xs font-bold text-[#212121] mb-1.5"
                  >
                    Patient Name
                  </label>
                  <input
                    id="consult-patient"
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#D1D5DB] text-sm text-[#212121] focus:border-[#FF6F61] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="consult-concern"
                    className="block text-xs font-bold text-[#212121] mb-1.5"
                  >
                    Primary Symptom / Concern
                  </label>
                  <input
                    id="consult-concern"
                    type="text"
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., Persistent fever for 2 days"
                    className="w-full h-10 px-3 rounded-lg border border-[#D1D5DB] text-sm text-[#212121] focus:border-[#FF6F61] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-sm font-bold transition-colors"
              >
                Confirm Video Consultation · ₹{selectedDoctor.fee}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Specialty Filter */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {specialties.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      selectedSpecialty === spec
                        ? 'bg-[#212121] text-white'
                        : 'bg-[#F8F9FA] text-[#757575] hover:text-[#212121]'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              {/* Doctors List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between p-4 rounded-xl border border-[#E8ECEF] bg-[#F8F9FA] hover:bg-white transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FF6F61]/12 text-[#FF6F61] flex items-center justify-center shrink-0">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-display text-sm font-bold text-[#212121]">
                              {doc.name}
                            </h3>
                            <p className="text-xs font-medium text-[#FF6F61]">
                              {doc.specialty}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1AAB2A]">
                          <Star className="w-3.5 h-3.5 fill-[#1AAB2A]" />
                          {doc.rating}
                        </span>
                      </div>

                      <p className="text-xs text-[#757575]">
                        {doc.qualification} · {doc.experienceYears} yrs exp
                      </p>
                      <p className="text-xs text-[#757575]">
                        Languages: {doc.languages.join(', ')} · {doc.consultationsCount}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8ECEF] flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[#212121] tabular-nums">
                          ₹{doc.fee}
                        </p>
                        <p className="text-[11px] text-[#1AAB2A] font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doc.nextSlot}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setSelectedSlot(doc.nextSlot);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Book Consult
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
