import { QueryClient } from '@tanstack/react-query';
import { Provider, DashboardStats } from '../types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Mock data
const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    firstName: 'John',
    lastName: 'Smith',
    npi: '1234567890',
    tin: '12-3456789',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    intakeSource: 'manual',
    status: 'validated',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:22:00Z',
    validationErrors: [],
    demographics: {
      dateOfBirth: '1975-06-15',
      gender: 'male',
      ssn: '***-**-1234',
    },
    contact: {
      address: {
        street: '123 Medical Center Dr',
        city: 'Boston',
        state: 'MA',
        zipCode: '02118',
        isValidated: true,
      },
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
    },
    credentials: {
      npi: '1234567890',
      tin: '12-3456789',
      stateLicenses: [
        {
          id: '1',
          state: 'MA',
          licenseNumber: 'MD12345',
          expirationDate: '2025-12-31',
          status: 'active',
        },
      ],
      specialties: [
        {
          taxonomyCode: '207Q00000X',
          description: 'Family Medicine',
          isPrimary: true,
        },
      ],
      deaNumber: 'BS1234567',
    },
    psvStatus: {
      licenses: { status: 'verified', lastChecked: '2024-01-16T09:00:00Z', source: 'State Board' },
      deaNpi: { status: 'verified', lastChecked: '2024-01-16T09:15:00Z', source: 'DEA/NPDB' },
      education: { status: 'verified', lastChecked: '2024-01-16T09:30:00Z', source: 'AMA' },
      malpractice: { status: 'verified', lastChecked: '2024-01-16T09:45:00Z', source: 'NPDB' },
      workHistory: { status: 'pending', lastChecked: '2024-01-16T10:00:00Z', source: 'Manual Review' },
      sanctions: { status: 'verified', lastChecked: '2024-01-16T10:15:00Z', source: 'OIG' },
      overallStatus: 'in-progress',
    },
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 987-6543',
    intakeSource: 'file-upload',
    status: 'failed',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    validationErrors: [
      { field: 'npi', message: 'NPI number is invalid', severity: 'error' },
      { field: 'license', message: 'License verification pending', severity: 'warning' },
    ],
    demographics: {
      dateOfBirth: '1980-03-22',
      gender: 'female',
    },
    contact: {
      address: {
        street: '456 Hospital Way',
        city: 'Cambridge',
        state: 'MA',
        zipCode: '02139',
        isValidated: false,
      },
      phone: '(555) 987-6543',
      email: 'sarah.johnson@email.com',
    },
    credentials: {
      stateLicenses: [],
      specialties: [
        {
          taxonomyCode: '208600000X',
          description: 'Surgery',
          isPrimary: true,
        },
      ],
    },
    psvStatus: {
      licenses: { status: 'failed', lastChecked: '2024-01-15T11:00:00Z', source: 'State Board' },
      deaNpi: { status: 'not-started' },
      education: { status: 'not-started' },
      malpractice: { status: 'not-started' },
      workHistory: { status: 'not-started' },
      sanctions: { status: 'not-started' },
      overallStatus: 'issues-found',
    },
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    npi: '9876543210',
    email: 'michael.chen@email.com',
    phone: '(555) 456-7890',
    intakeSource: 'api',
    status: 'new',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z',
    validationErrors: [],
    demographics: {
      dateOfBirth: '1978-11-08',
      gender: 'male',
    },
    contact: {
      address: {
        street: '789 Clinic Blvd',
        city: 'Somerville',
        state: 'MA',
        zipCode: '02143',
        isValidated: true,
      },
      phone: '(555) 456-7890',
      email: 'michael.chen@email.com',
    },
    credentials: {
      npi: '9876543210',
      stateLicenses: [
        {
          id: '2',
          state: 'MA',
          licenseNumber: 'MD67890',
          expirationDate: '2026-06-30',
          status: 'active',
        },
      ],
      specialties: [
        {
          taxonomyCode: '207R00000X',
          description: 'Internal Medicine',
          isPrimary: true,
        },
      ],
    },
    psvStatus: {
      licenses: { status: 'not-started' },
      deaNpi: { status: 'not-started' },
      education: { status: 'not-started' },
      malpractice: { status: 'not-started' },
      workHistory: { status: 'not-started' },
      sanctions: { status: 'not-started' },
      overallStatus: 'not-started',
    },
  },
];

// API Functions
export const api = {
  // Providers
  getProviders: async (): Promise<Provider[]> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    return mockProviders;
  },

  getProvider: async (id: string): Promise<Provider | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProviders.find(p => p.id === id) || null;
  },

  updateProvider: async (provider: Provider): Promise<Provider> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return provider;
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stats = mockProviders.reduce(
      (acc, provider) => {
        acc.totalProviders++;
        switch (provider.status) {
          case 'new':
            acc.new++;
            break;
          case 'validated':
            acc.validated++;
            break;
          case 'failed':
            acc.failed++;
            break;
        }
        return acc;
      },
      { new: 0, validated: 0, failed: 0, totalProviders: 0 }
    );
    return stats;
  },

  // PSV
  triggerPSVCheck: async (providerId: string, verificationType: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate PSV check
  },

  // Committee Review
  submitReview: async (providerId: string, decision: 'approve' | 'reject' | 'request-info', comments: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate review submission
  },
};