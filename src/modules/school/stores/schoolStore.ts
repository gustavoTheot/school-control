import { create } from 'zustand';

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
      const data = await schoolService.getAll(search);
      set({ schools: data as SchoolItem[] });
    } catch {
      set({ error: 'Erro ao carregar escolas.' });
    } finally {
      set({ isLoading: false });
    }
  },

  addSchool: async (data: CreateSchool) => {
    set({ error: null });

    try {
      const created = (await schoolService.create(data)) as SchoolItem;
      set((state) => ({ schools: [...state.schools, created] }));
    } catch (error) {
      set({ error: 'Erro ao criar escola.' });
      throw error;
    }
  },

  updateSchool: async (id: string, data: UpdateSchool) => {
    set({ error: null });

    try {
      const updated = (await schoolService.update(id, data)) as SchoolItem;
      set((state) => ({
        schools: state.schools.map((school) =>
          school.id === id ? { ...school, ...updated } : school,
        ),
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar escola.' });
      throw error;
    }
  },

  removeSchool: async (id: string) => {
    set({ error: null });

    try {
      await schoolService.delete(id);
      set((state) => ({ schools: state.schools.filter((school) => school.id !== id) }));
    } catch (error) {
      set({ error: 'Erro ao remover escola.' });
      throw error;
    }
  },
}));
