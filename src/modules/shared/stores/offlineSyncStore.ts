import { create } from 'zustand';

interface OfflineSyncState {
  pendingCount: number;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  lastError: string | null;
  setPendingCount: (pendingCount: number) => void;
  setIsSyncing: (isSyncing: boolean) => void;
  setLastSyncedAt: (lastSyncedAt: number | null) => void;
  setLastError: (lastError: string | null) => void;
}

export const useOfflineSyncStore = create<OfflineSyncState>((set) => ({
  pendingCount: 0,
  isSyncing: false,
  lastSyncedAt: null,
  lastError: null,
  setPendingCount: (pendingCount: number) => set({ pendingCount }),
  setIsSyncing: (isSyncing: boolean) => set({ isSyncing }),
  setLastSyncedAt: (lastSyncedAt: number | null) => set({ lastSyncedAt }),
  setLastError: (lastError: string | null) => set({ lastError }),
}));
