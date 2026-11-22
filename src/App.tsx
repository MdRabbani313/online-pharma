import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Truck,
  Award,
  SlidersHorizontal,
  X,
  ShoppingCart,
} from 'lucide-react';
import {
  COUPONS,
  HEALTH_CONCERNS,
  LAB_TESTS,
  LOCATIONS,
  PRODUCTS,
} from './data/mockData';
import {
  CartItem,
  CategoryTab,
  GenericSubstitute,
  HealthConcern,
  LabTestPackage,
  LocationOption,
  OrderConfirmation,
  PrescriptionRecord,
  Product,
  UserProfile,
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LabTestsSection } from './components/LabTestsSection';
import { PrescriptionModal } from './components/PrescriptionModal';
import { CartDrawer } from './components/CartDrawer';
import { DoctorConsultModal } from './components/DoctorConsultModal';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';

const CART_STORAGE_KEY = 'tata_1mg_cart_v1';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All');
  const [activeConcern, setActiveConcern] = useState<HealthConcern>('All');
  const [rxOnlyFilter, setRxOnlyFilter] = useState<'all' | 'otc' | 'rx'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [location, setLocation] = useState<LocationOption>(LOCATIONS[0]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [prescription, setPrescription] = useState<PrescriptionRecord | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderConfirmation[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist cart in localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  // Simulated pharmacist verification timeline when prescription is uploaded
  useEffect(() => {
    if (!prescription || prescription.status === 'Verified by Pharmacist') return;

    if (prescription.status === 'Pending Verification') {
      const t1 = window.setTimeout(() => {
        setPrescription((prev) =>
          prev
            ? {
                ...prev,
                status: 'Pharmacist Reviewing',
                pharmacistNote:
                  'Dr. Kavitha R. (RPh #KA-48219) is verifying dosage and doctor registration...',
              }
            : null
        );
      }, 1100);
      return () => window.clearTimeout(t1);
    }

    if (prescription.status === 'Pharmacist Reviewing') {
      const t2 = window.setTimeout(() => {
        setPrescription((prev) =>
          prev
            ? {
                ...prev,
                status: 'Verified by Pharmacist',
                pharmacistNote:
                  'Prescription verified and approved for all Rx medicines in your cart.',
              }
            : null
        );
      }, 1600);
      return () => window.clearTimeout(t2);
    }
  }, [prescription]);

  // Auto-dismiss subtle toast
  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cart) {
      map[item.id] = item.quantity;
    }
    return map;
  }, [cart]);

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      if (
        activeCategory !== 'All' &&
        activeCategory !== 'Lab Tests' &&
        activeCategory !== 'Consult Doctors' &&
        product.category !== activeCategory
      ) {
        return false;
      }

      if (
        activeConcern !== 'All' &&
        !product.healthConcerns.includes(activeConcern)
      ) {
        return false;
      }

      if (rxOnlyFilter === 'rx' && !product.rxRequired) return false;
      if (rxOnlyFilter === 'otc' && product.rxRequired) return false;

      if (!q) return true;

      return (
        product.name.toLowerCase().includes(q) ||
        product.saltComposition.toLowerCase().includes(q) ||
        product.manufacturer.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.healthConcerns.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, activeConcern, rxOnlyFilter, searchQuery]);

  const handleSelectCategory = (tab: CategoryTab) => {
    setActiveCategory(tab);
    if (tab === 'Lab Tests') {
      document
        .getElementById('lab-tests-section')
        ?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (tab === 'Consult Doctors') {
      setIsConsultModalOpen(true);
      return;
    }
    if (tab !== 'All') {
      document
        .getElementById('catalog-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddProduct = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          itemType: 'product',
          title: product.name,
          subtitle: product.packSize,
          manufacturerOrLab: product.manufacturer,
          price: product.price,
          mrp: product.mrp,
          quantity: 1,
          rxRequired: product.rxRequired,
          imageUrl: product.imageUrl,
        },
      ];
    });
    setToastMessage(`Added ${product.name} to cart`);
  };

  const handleAddSubstitute = (
    sub: GenericSubstitute,
    parentProduct: Product
  ) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === sub.id);
      if (existing) {
        return prev.map((i) =>
          i.id === sub.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: sub.id,
          itemType: 'product',
          title: sub.name,
          subtitle: `${sub.packSize} (Generic substitute)`,
          manufacturerOrLab: sub.manufacturer,
          price: sub.price,
          mrp: sub.mrp,
          quantity: 1,
          rxRequired: parentProduct.rxRequired,
          imageUrl: parentProduct.imageUrl,
        },
      ];
    });
    setToastMessage(`Added substitute ${sub.name} to cart`);
  };

  const handleBookLabTest = (test: LabTestPackage) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === test.id);
      if (existing) {
        return prev.map((i) =>
          i.id === test.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: test.id,
          itemType: 'lab',
          title: test.name,
          subtitle: `${test.testsCount} Tests · ${test.reportTime}`,
          manufacturerOrLab: test.accreditation,
          price: test.price,
          mrp: test.mrp,
          quantity: 1,
          rxRequired: false,
          imageUrl: test.imageUrl,
        },
      ];
    });
    setToastMessage(`Added ${test.name} to cart`);
  };

  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleApplyCoupon = (
    code: string | null
  ): { ok: boolean; message: string } => {
    if (!code) {
      setAppliedCouponCode(null);
      return { ok: true, message: 'Coupon removed.' };
    }
    const found = COUPONS.find((c) => c.code === code.toUpperCase());
    if (!found) {
      return {
        ok: false,
        message: 'Invalid code. Try FIRST20, CARE15, or HEALTH10.',
      };
    }
    const currentSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (currentSubtotal < found.minOrderValue) {
      return {
        ok: false,
        message: `Minimum order of ₹${found.minOrderValue} required for ${found.code}.`,
      };
    }
    setAppliedCouponCode(found.code);
    return {
      ok: true,
      message: `${found.code} applied — ${found.discountPercent}% instant savings!`,
    };
  };

  const handleOrderPlaced = (order: OrderConfirmation) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setAppliedCouponCode(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#212121]">
      {/* Sticky Top Navigation & Category Bar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        location={location}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onOpenRxModal={() => setIsRxModalOpen(true)}
        prescription={prescription}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Carousel & Quick Action Cards */}
        <HeroSection
          onBannerAction={(action) => {
            if (action === 'medicines') {
              setActiveCategory('Medicines');
              document
                .getElementById('catalog-section')
                ?.scrollIntoView({ behavior: 'smooth' });
            } else if (action === 'labs') {
              document
                .getElementById('lab-tests-section')
                ?.scrollIntoView({ behavior: 'smooth' });
            } else {
              setIsConsultModalOpen(true);
            }
          }}
          onApplyBannerCoupon={(code) => {
            setAppliedCouponCode(code);
            setToastMessage(`Coupon ${code} saved for checkout`);
          }}
          onOpenRxModal={() => setIsRxModalOpen(true)}
          onOpenConsultModal={() => setIsConsultModalOpen(true)}
          onScrollToLabs={() =>
            document
              .getElementById('lab-tests-section')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          prescription={prescription}
        />

        {/* Medicine & Healthcare Catalog Section */}
        <section
          id="catalog-section"
          className="max-w-[1320px] mx-auto px-4 lg:px-8 py-6"
        >
          {/* Section Header + Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-medium text-[#757575] mb-1">
                {location.deliveryEta} · {location.city} ({location.pincode})
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#212121]">
                {activeCategory === 'Ayurveda'
                  ? 'Ayurveda & Herbal Care'
                  : activeCategory === 'Health Devices'
                    ? 'Health & Monitoring Devices'
                    : 'Medicines & Healthcare Essentials'}
              </h2>
            </div>

            {/* OTC / Rx Quick Segmented Filter */}
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#757575]">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Type:
              </span>
              <div className="inline-flex items-center p-1 rounded-lg bg-[#F8F9FA] border border-[#E8ECEF]">
                {(
                  [
                    { key: 'all', label: 'All' },
                    { key: 'otc', label: 'OTC' },
                    { key: 'rx', label: 'Rx Only' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setRxOnlyFilter(opt.key)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                      rxOnlyFilter === opt.key
                        ? 'bg-white text-[#212121] shadow-xs'
                        : 'text-[#757575] hover:text-[#212121]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Health Concern Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 border-b border-[#F1F3F5]">
            {HEALTH_CONCERNS.map((concern) => {
              const isActive = activeConcern === concern;
              return (
                <button
                  key={concern}
                  type="button"
                  onClick={() => setActiveConcern(concern)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#212121] text-white'
                      : 'bg-[#F8F9FA] text-[#424242] hover:bg-[#ECEFF1]'
                  }`}
                >
                  {concern === 'All' ? 'All Concerns' : concern}
                </button>
              );
            })}

            {(searchQuery ||
              activeConcern !== 'All' ||
              activeCategory !== 'All' ||
              rxOnlyFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveConcern('All');
                  setActiveCategory('All');
                  setRxOnlyFilter('all');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF6F61] hover:bg-[#FF6F61]/8 whitespace-nowrap shrink-0 ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 rounded-xl bg-[#F8F9FA] border border-[#E8ECEF] text-center space-y-3">
              <p className="font-display text-base font-bold text-[#212121]">
                No matching medicines found
              </p>
              <p className="text-xs text-[#757575] max-w-md mx-auto">
                Try clearing your search query or switching back to All Concerns to view the full pharmacy catalog.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveConcern('All');
                  setActiveCategory('All');
                  setRxOnlyFilter('all');
                }}
                className="px-4 py-2 rounded-lg bg-[#FF6F61] hover:bg-[#E85A4D] text-white text-xs font-bold transition-colors"
              >
                Show All Medicines
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cartQuantities[product.id] || 0}
                  onAdd={handleAddProduct}
                  onUpdateQty={handleUpdateQty}
                  onOpenDetail={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Horizontal Scrollable Lab Tests & Health Checkups */}
        <LabTestsSection
          labTests={LAB_TESTS}
          cartQuantities={cartQuantities}
          onBookTest={handleBookLabTest}
          onUpdateQty={handleUpdateQty}
        />

        {/* Trust Bar */}
        <section className="bg-[#F8F9FA] border-t border-[#E8ECEF]">
          <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E8ECEF] flex items-center justify-center text-[#1AAB2A] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-[#212121]">
                  100% Genuine Medicines
                </h3>
                <p className="text-xs text-[#757575] mt-1 leading-relaxed">
                  Sourced directly from licensed manufacturers &amp; verified stockists with batch traceability.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E8ECEF] flex items-center justify-center text-[#FF6F61] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-[#212121]">
                  NABL Certified Diagnostics
                </h3>
                <p className="text-xs text-[#757575] mt-1 leading-relaxed">
                  Temperature-controlled home sample pickup and pathologist-verified digital lab reports.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E8ECEF] flex items-center justify-center text-[#212121] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-[#212121]">
                  Same-Day Express Delivery
                </h3>
                <p className="text-xs text-[#757575] mt-1 leading-relaxed">
                  Fast doorstep dispatch across Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai &amp; Pune.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-[#E8ECEF]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#757575]">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#212121]">Tata 1mg</span>
            <span aria-hidden="true">·</span>
            <span>Online Pharmacy, Lab Tests &amp; Teleconsultation</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsRxModalOpen(true)}
              className="hover:text-[#212121] transition-colors"
            >
              Upload Prescription
            </button>
            <button
              type="button"
              onClick={() => setIsConsultModalOpen(true)}
              className="hover:text-[#212121] transition-colors"
            >
              Consult Doctors
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="hover:text-[#212121] transition-colors"
            >
              View Cart
            </button>
          </div>
        </div>
      </footer>

      {/* Subtle Add-to-Cart Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#212121] text-white text-xs font-medium shadow-xl">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="inline-flex items-center gap-1 text-[#FF6F61] font-bold hover:underline whitespace-nowrap"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            View Cart
          </button>
        </div>
      )}

      {/* Modals & Slide-Over Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        quantity={selectedProduct ? cartQuantities[selectedProduct.id] || 0 : 0}
        substituteQuantities={cartQuantities}
        onClose={() => setSelectedProduct(null)}
        onAddProduct={handleAddProduct}
        onUpdateQty={handleUpdateQty}
        onAddSubstitute={handleAddSubstitute}
      />

      <PrescriptionModal
        isOpen={isRxModalOpen}
        prescription={prescription}
        onClose={() => setIsRxModalOpen(false)}
        onUploadPrescription={(record) => setPrescription(record)}
        onRemovePrescription={() => setPrescription(null)}
        onContinueToCart={() => {
          setIsRxModalOpen(false);
          if (cart.length > 0) setIsCartOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        location={location}
        prescription={prescription}
        appliedCouponCode={appliedCouponCode}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onApplyCoupon={handleApplyCoupon}
        onOpenRxModal={() => setIsRxModalOpen(true)}
        onOrderPlaced={handleOrderPlaced}
      />

      <DoctorConsultModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        currentLocation={location}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={(loc) => setLocation(loc)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        user={user}
        orders={orders}
        prescription={prescription}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(u) => setUser(u)}
        onLogout={() => setUser(null)}
      />
    </div>
  );
}
