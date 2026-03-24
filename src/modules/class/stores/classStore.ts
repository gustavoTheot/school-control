import { create } from 'zustand';

import { ClassClass } from '../services/classService';
import { Class, CreateClass, UpdateClass } from '../types/classDto';

export type ClassItem = Class & { id: string };

interface ClassState {
  classes: ClassItem[];
  selectedSchoolId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchClasses: (schoolId: string, search?: string) => Promise<void>;
  addClass: (data: CreateClass) => Promise<void>;
  updateClass: (id: string, data: UpdateClass) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
}

const classService = new ClassClass();

export const useClassStore = create<ClassState>((set) => ({
  classes: [],
  selectedSchoolId: null,
  isLoading: false,
  error: null,

  fetchClasses: async (schoolId: string, search?: string) => {
    set((state) => ({
      isLoading: true,
      error: null,
      selectedSchoolId: schoolId,
      classes: state.selectedSchoolId === schoolId ? state.classes : [],
    }));

    try {
      const data = await classService.getAll(schoolId, search);
      set({ classes: data as ClassItem[] });
    } catch {
      set({ classes: [], error: 'Erro ao carregar turmas.' });
    } finally {
      set({ isLoading: false });
    }
  },

  addClass: async (data: CreateClass) => {
    set({ error: null });

    try {
      const created = (await classService.create(data)) as ClassItem;

      set((state) => ({
        classes:
          state.selectedSchoolId === created.schoolId ? [...state.classes, created] : state.classes,
      }));
    } catch (error) {
      set({ error: 'Erro ao criar turma.' });
      throw error;
    }
  },

  updateClass: async (id: string, data: UpdateClass) => {
    set({ error: null });

    try {
      const updated = (await classService.update(id, data)) as ClassItem;

      set((state) => ({
        classes: state.classes.map((classItem) =>
          classItem.id === id ? { ...classItem, ...updated } : classItem,
        ),
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar turma.' });
      throw error;
    }
  },

  removeClass: async (id: string) => {
    set({ error: null });

    try {
      await classService.delete(id);
      set((state) => ({ classes: state.classes.filter((classItem) => classItem.id !== id) }));
    } catch (error) {
      set({ error: 'Erro ao remover turma.' });
      throw error;
    }
  },
}));
