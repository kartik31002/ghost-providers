import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Provider, User, Notification, DashboardStats } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  sidebarOpen: boolean;
  notifications: Notification[];
  unreadNotifications: number;
  
  // Data
  providers: Provider[];
  selectedProvider: Provider | null;
  dashboardStats: DashboardStats;
  
  // Loading states
  loading: {
    providers: boolean;
    dashboard: boolean;
    provider: boolean;
  };
  
  // Actions
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setProviders: (providers: Provider[]) => void;
  setSelectedProvider: (provider: Provider | null) => void;
  updateProvider: (provider: Provider) => void;
  setDashboardStats: (stats: DashboardStats) => void;
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@healthsystem.com',
        role: 'admin',
      },
      isAuthenticated: true,
      sidebarOpen: true,
      notifications: [],
      unreadNotifications: 0,
      providers: [],
      selectedProvider: null,
      dashboardStats: {
        new: 0,
        validated: 0,
        failed: 0,
        totalProviders: 0,
      },
      loading: {
        providers: false,
        dashboard: false,
        provider: false,
      },
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadNotifications: state.unreadNotifications + 1,
        }));
      },
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadNotifications: Math.max(0, state.unreadNotifications - 1),
      })),
      
      clearNotifications: () => set({ notifications: [], unreadNotifications: 0 }),
      
      setProviders: (providers) => set({ providers }),
      
      setSelectedProvider: (provider) => set({ selectedProvider: provider }),
      
      updateProvider: (updatedProvider) => set((state) => ({
        providers: state.providers.map((p) =>
          p.id === updatedProvider.id ? updatedProvider : p
        ),
        selectedProvider: state.selectedProvider?.id === updatedProvider.id 
          ? updatedProvider 
          : state.selectedProvider,
      })),
      
      setDashboardStats: (stats) => set({ dashboardStats: stats }),
      
      setLoading: (key, value) => set((state) => ({
        loading: { ...state.loading, [key]: value },
      })),
    }),
    { name: 'provider-credentialing-store' }
  )
);