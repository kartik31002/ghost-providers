export interface Provider {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  npi?: string;
  tin?: string;
  email: string;
  phone: string;
  intakeSource: 'manual' | 'file-upload' | 'api';
  status: 'new' | 'validated' | 'failed' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  validationErrors: ValidationError[];
  demographics: Demographics;
  contact: ContactInfo;
  credentials: Credentials;
  psvStatus: PSVStatus;
}

export interface Demographics {
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  ssn?: string;
}

export interface ContactInfo {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isValidated: boolean;
  };
  phone: string;
  email: string;
}

export interface Credentials {
  npi?: string;
  tin?: string;
  stateLicenses: StateLicense[];
  specialties: Specialty[];
  deaNumber?: string;
}

export interface StateLicense {
  id: string;
  state: string;
  licenseNumber: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'suspended' | 'pending';
}

export interface Specialty {
  taxonomyCode: string;
  description: string;
  isPrimary: boolean;
}

export interface PSVStatus {
  licenses: VerificationStatus;
  deaNpi: VerificationStatus;
  education: VerificationStatus;
  malpractice: VerificationStatus;
  workHistory: VerificationStatus;
  sanctions: VerificationStatus;
  overallStatus: 'not-started' | 'in-progress' | 'completed' | 'issues-found';
}

export interface VerificationStatus {
  status: 'verified' | 'pending' | 'failed' | 'not-started';
  lastChecked?: string;
  source?: string;
  notes?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface DashboardStats {
  new: number;
  validated: number;
  failed: number;
  totalProviders: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reviewer' | 'coordinator';
  avatar?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}