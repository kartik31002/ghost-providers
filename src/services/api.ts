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
    intakeSource: 'Roster Automation',
    status: 'Provider Credentialled',
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
    intakeSource: 'File Upload',
    status: 'Application Validation Failed',
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
    intakeSource: 'Provider Email',
    status: 'New',
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
  {
    id: '4',
    name: 'Dr. Emily White',
    firstName: 'Emily',
    lastName: 'White',
    npi: '1122334455',
    email: 'emily.white@email.com',
    phone: '(555) 555-1212',
    intakeSource: 'Roster Automation',
    status: 'Application Review in Progress',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T11:00:00Z',
    validationErrors: [],
    demographics: { dateOfBirth: '1982-09-20', gender: 'female' },
    contact: {
      address: { street: '101 Health St', city: 'Boston', state: 'MA', zipCode: '02115', isValidated: true },
      phone: '(555) 555-1212',
      email: 'emily.white@email.com',
    },
    credentials: { npi: '1122334455', stateLicenses: [], specialties: [] },
    psvStatus: { licenses: { status: 'pending' }, deaNpi: { status: 'pending' }, education: { status: 'pending' }, malpractice: { status: 'not-started' }, workHistory: { status: 'not-started' }, sanctions: { status: 'not-started' }, overallStatus: 'in-progress' },
  },
  {
    id: '5',
    name: 'Dr. David Green',
    firstName: 'David',
    lastName: 'Green',
    npi: '2233445566',
    email: 'david.green@email.com',
    phone: '(555) 555-1313',
    intakeSource: 'File Upload',
    status: 'Application Submitted',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
    validationErrors: [],
    demographics: { dateOfBirth: '1970-01-30', gender: 'male' },
    contact: {
      address: { street: '202 Wellness Ave', city: 'Cambridge', state: 'MA', zipCode: '02140', isValidated: true },
      phone: '(555) 555-1313',
      email: 'david.green@email.com',
    },
    credentials: { npi: '2233445566', stateLicenses: [], specialties: [] },
    psvStatus: { licenses: { status: 'not-started' }, deaNpi: { status: 'not-started' }, education: { status: 'not-started' }, malpractice: { status: 'not-started' }, workHistory: { status: 'not-started' }, sanctions: { status: 'not-started' }, overallStatus: 'not-started' },
  },
  {
    id: '6',
    name: 'Dr. Jessica Brown',
    firstName: 'Jessica',
    lastName: 'Brown',
    npi: '3344556677',
    email: 'jessica.brown@email.com',
    phone: '(555) 555-1414',
    intakeSource: 'Provider Email',
    status: 'PSV In Progress',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T12:30:00Z',
    validationErrors: [],
    demographics: { dateOfBirth: '1985-07-25', gender: 'female' },
    contact: {
      address: { street: '303 Care Blvd', city: 'Somerville', state: 'MA', zipCode: '02144', isValidated: true },
      phone: '(555) 555-1414',
      email: 'jessica.brown@email.com',
    },
    credentials: { npi: '3344556677', stateLicenses: [], specialties: [] },
    psvStatus: { licenses: { status: 'pending' }, deaNpi: { status: 'verified' }, education: { status: 'verified' }, malpractice: { status: 'pending' }, workHistory: { status: 'pending' }, sanctions: { status: 'verified' }, overallStatus: 'in-progress' },
  },
  {
    id: '7',
    name: 'Dr. Robert Black',
    firstName: 'Robert',
    lastName: 'Black',
    npi: '4455667788',
    email: 'robert.black@email.com',
    phone: '(555) 555-1515',
    intakeSource: 'Roster Automation',
    status: 'Application Validation Failed',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T13:00:00Z',
    validationErrors: [{ field: 'tin', message: 'TIN does not match IRS records', severity: 'error' }],
    demographics: { dateOfBirth: '1965-12-01', gender: 'male' },
    contact: {
      address: { street: '404 Error Rd', city: 'Boston', state: 'MA', zipCode: '02116', isValidated: false },
      phone: '(555) 555-1515',
      email: 'robert.black@email.com',
    },
    credentials: { npi: '4455667788', stateLicenses: [], specialties: [] },
    psvStatus: { licenses: { status: 'verified' }, deaNpi: { status: 'verified' }, education: { status: 'verified' }, malpractice: { status: 'verified' }, workHistory: { status: 'verified' }, sanctions: { status: 'verified' }, overallStatus: 'completed' },
  },
  {
    id: '8',
    name: 'Dr. Laura King',
    firstName: 'Laura',
    lastName: 'King',
    npi: '5566778899',
    email: 'laura.king@email.com',
    phone: '(555) 555-1616',
    intakeSource: 'File Upload',
    status: 'PSV Failed',
    createdAt: '2024-01-21T15:00:00Z',
    updatedAt: '2024-01-21T16:45:00Z',
    validationErrors: [],
    demographics: { dateOfBirth: '1979-05-10', gender: 'female' },
    contact: {
      address: { street: '505 Sanction Way', city: 'Cambridge', state: 'MA', zipCode: '02138', isValidated: true },
      phone: '(555) 555-1616',
      email: 'laura.king@email.com',
    },
    credentials: { npi: '5566778899', stateLicenses: [], specialties: [] },
    psvStatus: { licenses: { status: 'verified' }, deaNpi: { status: 'verified' }, education: { status: 'verified' }, malpractice: { status: 'verified' }, workHistory: { status: 'verified' }, sanctions: { status: 'failed', notes: 'OIG Sanction found' }, overallStatus: 'issues-found' },
  },
  {
    id: '9',
    name: 'Dr. James Wilson',
    firstName: 'James',
    lastName: 'Wilson',
    npi: '6677889900',
    email: 'james.wilson@email.com',
    phone: '(555) 555-1717',
    intakeSource: 'Provider Email',
    status: 'Committee Approval Pending',
    createdAt: '2024-01-22T16:00:00Z',
    updatedAt: '2024-01-22T17:30:00Z',
    validationErrors: [],
    demographics: { dateOfBirth: '1988-11-18', gender: 'male' },
    contact: {
      address: { street: '606 Review St', city: 'Somerville', state: 'MA', zipCode: '02145', isValidated: true },
      phone: '(555) 555-1717',
      email: 'james.wilson@email.com',
    },
    credentials: { npi: '6677889900', stateLicenses: [], specialties: [] },
    psvStatus: { licenses: { status: 'verified' }, deaNpi: { status: 'verified' }, education: { status: 'verified' }, malpractice: { status: 'verified' }, workHistory: { status: 'verified' }, sanctions: { status: 'verified' }, overallStatus: 'completed' },
  },
  {
    id: '10',
    name: 'Dr. Olivia Martinez',
    firstName: 'Olivia',
    lastName: 'Martinez',
    npi: '7788990011',
    email: 'olivia.martinez@email.com',
    phone: '(555) 555-1818',
    intakeSource: 'Roster Automation',
    status: 'Provider Credentialled',
    createdAt: '2024-01-23T18:00:00Z',
    updatedAt: '2024-01-23T19:00:00Z',
    validationErrors: [],
    demographics: { dateOfBirth: '1990-02-14', gender: 'female' },
    contact: {
      address: { street: '707 Approved Ave', city: 'Boston', state: 'MA', zipCode: '02114', isValidated: true },
      phone: '(555) 555-1818',
      email: 'olivia.martinez@email.com',
    },
    credentials: { npi: '7788990011', stateLicenses: [], specialties: [] },
    psvStatus: { licenses: { status: 'verified' }, deaNpi: { status: 'verified' }, education: { status: 'verified' }, malpractice: { status: 'verified' }, workHistory: { status: 'verified' }, sanctions: { status: 'verified' }, overallStatus: 'completed' },
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
          case 'New':
            acc.new++;
            break;
          case 'Application Review in Progress':
            acc.inProgress++;
            break;
          case 'Application Submitted':
            acc.submitted++;
            break;
          case 'PSV In Progress':
            acc.psvInProgress++;
            break;
          case 'Application Validation Failed':
            acc.validationFailed++;
            break;
          case 'PSV Failed':
            acc.psvFailed++;
            break;
          case 'Committee Approval Pending':
            acc.pendingCommittee++;
            break;
          case 'Provider Credentialled':
            acc.credentialed++;
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
      {
        new: 0,
        inProgress: 0,
        submitted: 0,
        psvInProgress: 0,
        validationFailed: 0,
        psvFailed: 0,
        pendingCommittee: 0,
        credentialed: 0,
        validated: 0,
        failed: 0,
        totalProviders: 0,
      }
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