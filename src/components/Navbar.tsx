import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  FileText,
  ShoppingCart,
  User,
  ChevronDown,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  CategoryTab,
  LocationOption,
  PrescriptionRecord,
  Product,
  UserProfile,
} from '../types';

interface NavbarProps {
  activeCategory: CategoryTab;
  onSelectCategory: (tab: CategoryTab) => void;
  location: LocationOption;
  onOpenLocationModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenRxModal: () => void;
  prescription: PrescriptionRecord | null;
  cartCount: number;
  onOpenCart: () => void;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
}

const CATEGORY_TABS: CategoryTab[] = [
  'All',
  'Medicines',
  'Lab Tests',
  'Consult Doctors',
  'Ayurveda',
  'Health Devices',
];

const QUICK_SEARCH_TERMS = ['Dolo', 'Paracetamol', 'Diabetes', 'Acidity', 'Pain Relief', 'Chyawanprash'];

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  location,
  onOpenLocationModal,
  searchQuery,
  onSearchChange,
  products,
  onSelectProduct,
  onOpenRxModal,
  prescription,
  cartCount,
  onOpenCart,
  user,
  onOpenAuthModal,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickMatches = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.saltComposition.toLowerCase().includes(q) ||
            p.manufacturer.toLowerCase().includes(q) ||
            p.healthConcerns.some((c) => c.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E8ECEF]">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        {/* Primary Navigation Row */}
        <div className="flex items-center justify-between gap-3 md:gap-6 h-16">
          {/* Brand + Location */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61] rounded-md whitespace-nowrap shrink-0"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#FF6F61] text-white font-display font-extrabold text-sm tracking-tight">
                1mg
              </span>
              <span className="font-display font-bold text-lg tracking-tight text-[#212121]">
                Tata 1mg
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenLocationModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#F8F9FA] hover:bg-[#F1F3F5] text-xs font-medium text-[#212121] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
              aria-label="Change delivery location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF6F61] shrink-0" />
              <span>
                {location.city} - {location.pincode}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#757575]" />
            </button>
          </div>

          {/* Live Search Bar */}
          <div ref={searchWrapRef} className="relative flex-1 max-w-xl hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#757575] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="Search medicines, salt compositions, or concerns (Fever, Diabetes...)"
                className="w-full h-10 pl-10 pr-9 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#212121] placeholder:text-[#757575] focus:bg-white focus:border-[#FF6F61] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 p-1 text-[#757575] hover:text-[#212121]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchFocused && (
              <div className="absolute left-0 right-0 top-11 bg-white border border-[#E5E7EB] rounded-lg shadow-lg overflow-hidden z-50">
                {searchQuery.trim() === '' ? (
                  <div className="p-3">
                    <p className="text-xs font-medium text-[#757575] mb-2">
                      Popular searches
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_SEARCH_TERMS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            onSearchChange(term);
                            setSearchFocused(false);
                          }}
                          className="px-2.5 py-1 text-xs font-medium bg-[#F8F9FA] hover:bg-[#FF6F61]/10 hover:text-[#FF6F61] text-[#212121] rounded-md transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : quickMatches.length > 0 ? (
                  <div className="divide-y divide-[#F1F3F5]">
                    {quickMatches.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectProduct(item);
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#F8F9FA] text-left transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#212121] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#757575] truncate">
                            {item.saltComposition} · {item.packSize}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-[#212121] tabular-nums">
                            ₹{item.price.toFixed(2)}
                          </p>
                          <p className="text-[11px] font-medium text-[#1AAB2A]">
                            {item.discountPercent}% OFF
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#757575]">
                    No medicines found matching &ldquo;{searchQuery}&rdquo;. Try searching Paracetamol or Diabetes.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenRxModal}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61] ${
                prescription?.status === 'Verified by Pharmacist'
                  ? 'bg-[#1AAB2A]/10 text-[#1AAB2A] hover:bg-[#1AAB2A]/15'
                  : 'bg-[#FF6F61] text-white hover:bg-[#E85A4D]'
              }`}
            >
              {prescription?.status === 'Verified by Pharmacist' ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <FileText className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden sm:inline">
                {prescription?.status === 'Verified by Pharmacist'
                  ? 'Rx Verified'
                  : 'Upload Prescription'}
              </span>
              <span className="sm:hidden">Rx</span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open cart with ${cartCount} items`}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#212121] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
            >
              <ShoppingCart className="w-4 h-4 text-[#212121]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-[#FF6F61] text-white text-[11px] font-bold tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-[#F8F9FA] text-xs font-medium text-[#212121] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
            >
              <User className="w-4 h-4 text-[#757575]" />
              <span className="hidden lg:inline max-w-[100px] truncate">
                {user ? user.name.split(' ')[0] : 'Login'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search + Location Row (compact, only on <md) */}
        <div className="flex items-center gap-2 pb-2.5 md:hidden">
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-[#F8F9FA] text-xs font-medium text-[#212121] whitespace-nowrap shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6F61]" />
            <span>{location.pincode}</span>
          </button>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search medicines, salts, Fever..."
              className="w-full h-9 pl-8 pr-8 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs text-[#212121] placeholder:text-[#757575] focus:bg-white focus:border-[#FF6F61] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear mobile search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757575]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-header Category Navigation Bar */}
        <nav
          aria-label="Healthcare categories"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-[#F1F3F5] py-1.5"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onSelectCategory(tab)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61] ${
                  isActive
                    ? 'text-[#FF6F61] bg-[#FF6F61]/8 font-semibold'
                    : 'text-[#757575] hover:text-[#212121] hover:bg-[#F8F9FA]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
