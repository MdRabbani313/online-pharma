export type CategoryTab =
  | 'All'
  | 'Medicines'
  | 'Lab Tests'
  | 'Consult Doctors'
  | 'Ayurveda'
  | 'Health Devices';

export type HealthConcern =
  | 'All'
  | 'Fever'
  | 'Diabetes'
  | 'Pain Relief'
  | 'Acidity'
  | 'Infection'
  | 'Immunity'
  | 'Allergy'
  | 'Bone & Nerve';

export interface SafetyAdviceItem {
  topic: 'Alcohol' | 'Pregnancy' | 'Driving' | 'Kidney' | 'Liver';
  status: 'Safe' | 'Caution' | 'Consult Doctor' | 'Unsafe';
  note: string;
}

export interface GenericSubstitute {
  id: string;
  name: string;
  manufacturer: string;
  packSize: string;
  price: number;
  mrp: number;
  savingsPercent: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Medicines' | 'Ayurveda' | 'Health Devices';
  healthConcerns: HealthConcern[];
  packSize: string;
  manufacturer: string;
  saltComposition: string;
  mrp: number;
  price: number;
  discountPercent: number;
  rxRequired: boolean;
  imageUrl: string;
  imageBgLabel: string;
  rating: number;
  reviewCount: number;
  uses: string[];
  sideEffects: string[];
  safetyAdvice: SafetyAdviceItem[];
  substitutes: GenericSubstitute[];
}

export interface LabTestPackage {
  id: string;
  name: string;
  subtitle: string;
  testsCount: number;
  includedTests: string[];
  mrp: number;
  price: number;
  discountPercent: number;
  reportTime: string;
  fastingRequired: string;
  sampleType: string;
  accreditation: string;
  imageUrl: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  fee: number;
  nextSlot: string;
  rating: number;
  consultationsCount: string;
}

export interface CartItem {
  id: string;
  itemType: 'product' | 'lab';
  title: string;
  subtitle: string;
  manufacturerOrLab: string;
  price: number;
  mrp: number;
  quantity: number;
  rxRequired: boolean;
  imageUrl: string;
}

export type PrescriptionStatus =
  | 'Pending Verification'
  | 'Pharmacist Reviewing'
  | 'Verified by Pharmacist';

export interface PrescriptionRecord {
  id: string;
  fileName: string;
  fileType: string;
  previewUrl: string;
  uploadedAt: string;
  status: PrescriptionStatus;
  pharmacistNote: string;
}

export interface LocationOption {
  city: string;
  pincode: string;
  deliveryEta: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

export interface CouponDefinition {
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
}

export interface OrderConfirmation {
  orderId: string;
  items: CartItem[];
  itemTotalMrp: number;
  productDiscount: number;
  couponCode: string | null;
  couponDiscount: number;
  deliveryFee: number;
  toPay: number;
  address: string;
  paymentMethod: string;
  estimatedDelivery: string;
  labVisitSlot: string | null;
  hasRx: boolean;
  hasLabTests: boolean;
  placedAt: string;
}
