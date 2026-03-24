import { create } from 'zustand';

import { classCacheKey, SCHOOL_CACHE_KEY } from '../../shared/utils/offlineKeys';
import { isLikelyNetworkError } from '../../shared/utils/networkError';
import { enqueueOfflineOperation, syncOfflineOutbox } from '../../shared/utils/offlineSync';
import { readOfflineItem, removeOfflineItem, writeOfflineItem } from '../../shared/utils/offlineStorage';
import { SchoolService } from '../services/schoolService';
import { CreateSchool, School, UpdateSchool } from '../types/schoolDto';

export type SchoolItem = School & { id: string };

interface SchoolState {
  schools: SchoolItem[];
  isLoading: boolean;
  error: string | null;
  fetchSchools: (search?: string) => Promise<void>;
  addSchool: (data: CreateSchool) => Promise<void>;
  updateSchool: (id: string, data: UpdateSchool) => Promise<void>;
  removeSchool: (id: string) => Promise<void>;
}

const schoolService = new SchoolService();

export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  isLoading: false,
  error: null,

  fetchSchools: async (search?: string) => {
    set({ isLoading: true, error: null });

    try {
      await syncOfflineOutbox();

      const data = await schoolService.getAll(search);
      const schools = data as SchoolItem[];
      set({ schools });

      if (!search) {
        await writeOfflineItem(SCHOOL_CACHE_KEY, schools);
      }
    } catch {
      const cachedSchools = (await readOfflineItem<SchoolItem[]>(SCHOOL_CACHE_KEY)) || [];

      if (cachedSchools.length) {
        const normalizedSearch = search?.trim().toLowerCase();
        const filteredSchools = normalizedSearch
          ? cachedSchools.filter(
              (school) =>
                school.name.toLowerCase().includes(normalizedSearch) ||
                school.address.toLowerCase().includes(normalizedSearch),
            )
          : cachedSchools;

        set({ schools: filteredSchools, error: null });
      } else {
        set({ error: 'Erro ao carregar escolas.' });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  addSchool: async (data: CreateSchool) => {
    set({ error: null });

    try {
      const created = await schoolService.create(data);
      const createdSchool = created as SchoolItem;

      set((state) => {
        const nextSchools = [...state.schools, createdSchool];
        void writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
        return { schools: nextSchools };
      });

      await syncOfflineOutbox();
    } catch (error) {
      if (isLikelyNetworkError(error)) {
        const localSchool: SchoolItem = {
          id: `local-school-${Date.now()}`,
          name: data.name,
          address: data.address,
          number_of_classes: 0,
        };

        set((state) => {
          const nextSchools = [...state.schools, localSchool];
          void writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
          return { schools: nextSchools, error: null };
        });

        await enqueueOfflineOperation({
          entity: 'school',
          action: 'create',
          targetId: localSchool.id,
          payload: data,
        });

        return;
      }

      set({ error: 'Erro ao criar escola.' });
      throw error;
    }
  },

  updateSchool: async (id: string, data: UpdateSchool) => {
    set({ error: null });

    try {
      const updated = await schoolService.update(id, data);
      const updatedSchool = updated as SchoolItem;

      set((state) => ({
        schools: (() => {
          const nextSchools = state.schools.map((school) =>
            school.id === id ? { ...school, ...updatedSchool } : school,
          );
          void writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
          return nextSchools;
        })(),
      }));

      await syncOfflineOutbox();
    } catch (error) {
      if (isLikelyNetworkError(error)) {
        set((state) => {
          const nextSchools = state.schools.map((school) =>
            school.id === id ? { ...school, ...data } : school,
          );
          void writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
          return { schools: nextSchools, error: null };
        });

        await enqueueOfflineOperation({
          entity: 'school',
          action: 'update',
          targetId: id,
          payload: data,
        });

        return;
      }

      set({ error: 'Erro ao atualizar escola.' });
      throw error;
    }
  },

  removeSchool: async (id: string) => {
    set({ error: null });

    try {
      await schoolService.delete(id);
      set((state) => {
        const nextSchools = state.schools.filter((school) => school.id !== id);
        void writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
        void removeOfflineItem(classCacheKey(id));
        return { schools: nextSchools };
      });

      await syncOfflineOutbox();
    } catch (error) {
      if (isLikelyNetworkError(error)) {
        set((state) => {
          const nextSchools = state.schools.filter((school) => school.id !== id);
          void writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
          void removeOfflineItem(classCacheKey(id));
          return { schools: nextSchools, error: null };
        });

        await enqueueOfflineOperation({
          entity: 'school',
          action: 'delete',
          targetId: id,
        });

        return;
      }

      set({ error: 'Erro ao remover escola.' });
      throw error;
    }
  },
}));
