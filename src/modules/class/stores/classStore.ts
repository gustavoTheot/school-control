import { create } from 'zustand';

import { classCacheKey, SCHOOL_CACHE_KEY } from '../../shared/utils/offlineKeys';
import { isLikelyNetworkError } from '../../shared/utils/networkError';
import { enqueueOfflineOperation, syncOfflineOutbox } from '../../shared/utils/offlineSync';
import { readOfflineItem, writeOfflineItem } from '../../shared/utils/offlineStorage';
import { ClassClass } from '../services/classService';
import { Class, CreateClass, UpdateClass } from '../types/classDto';

export type ClassItem = Class & { id: string };

const updateSchoolCountInCache = async (schoolId: string, delta: number) => {
  const schools = (await readOfflineItem<Array<{ id: string; number_of_classes: number } & Record<string, unknown>>(
    SCHOOL_CACHE_KEY,
  )) || [];

  const nextSchools = schools.map((school) =>
    school.id === schoolId
      ? {
          ...school,
          number_of_classes: Math.max(0, Number(school.number_of_classes || 0) + delta),
        }
      : school,
  );

  await writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
};

interface ClassState {
  classes: ClassItem[];
  isLoading: boolean;
  error: string | null;
  fetchClasses: (schoolId: string, search?: string) => Promise<void>;
  addClass: (data: CreateClass) => Promise<void>;
  updateClass: (id: string, data: UpdateClass) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
}

const classService = new ClassClass();

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  isLoading: false,
  error: null,

  fetchClasses: async (schoolId: string, search?: string) => {
    set({ isLoading: true, error: null });

    try {
      await syncOfflineOutbox();

      const data = await classService.getAll(schoolId, search);
      const classes = data as ClassItem[];
      set({ classes });

      if (!search) {
        await writeOfflineItem(classCacheKey(schoolId), classes);
      }
    } catch {
      const cachedClasses = (await readOfflineItem<ClassItem[]>(classCacheKey(schoolId))) || [];

      if (cachedClasses.length) {
        const normalizedSearch = search?.trim().toLowerCase();
        const filteredClasses = normalizedSearch
          ? cachedClasses.filter((classItem) => classItem.name.toLowerCase().includes(normalizedSearch))
          : cachedClasses;

        set({ classes: filteredClasses, error: null });
      } else {
        set({ error: 'Erro ao carregar turmas.' });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  addClass: async (data: CreateClass) => {
    set({ error: null });

    try {
      const created = await classService.create(data);
      const createdClass = created as ClassItem;

      set((state) => {
        const nextClasses = [...state.classes, createdClass];
        void writeOfflineItem(classCacheKey(createdClass.schoolId), nextClasses);
        return { classes: nextClasses };
      });

      await updateSchoolCountInCache(createdClass.schoolId, 1);
      await syncOfflineOutbox();
    } catch (error) {
      if (isLikelyNetworkError(error)) {
        const localClass: ClassItem = {
          id: `local-class-${Date.now()}`,
          schoolId: data.schoolId,
          name: data.name,
          shift: data.shift,
          school_year: data.school_year,
        };

        set((state) => {
          const nextClasses = [...state.classes, localClass];
          void writeOfflineItem(classCacheKey(localClass.schoolId), nextClasses);
          return { classes: nextClasses, error: null };
        });

        await updateSchoolCountInCache(localClass.schoolId, 1);

        await enqueueOfflineOperation({
          entity: 'class',
          action: 'create',
          targetId: localClass.id,
          payload: data,
        });

        return;
      }

      set({ error: 'Erro ao criar turma.' });
      throw error;
    }
  },

  updateClass: async (id: string, data: UpdateClass) => {
    set({ error: null });

    try {
      const updated = await classService.update(id, data);
      const updatedClass = updated as ClassItem;

      set((state) => ({
        classes: (() => {
          const nextClasses = state.classes.map((classItem) =>
            classItem.id === id ? { ...classItem, ...updatedClass } : classItem,
          );
          const schoolIdForCache =
            updatedClass.schoolId || state.classes.find((classItem) => classItem.id === id)?.schoolId;

          if (schoolIdForCache) {
            void writeOfflineItem(classCacheKey(schoolIdForCache), nextClasses);
          }
          return nextClasses;
        })(),
      }));

      await syncOfflineOutbox();
    } catch (error) {
      if (isLikelyNetworkError(error)) {
        set((state) => ({
          classes: state.classes.map((classItem) =>
            classItem.id === id ? { ...classItem, ...data } : classItem,
          ),
          error: null,
        }));

        const schoolIdForCache = get().classes.find((classItem) => classItem.id === id)?.schoolId;
        if (schoolIdForCache) {
          await writeOfflineItem(classCacheKey(schoolIdForCache), get().classes);
        }

        await enqueueOfflineOperation({
          entity: 'class',
          action: 'update',
          targetId: id,
          payload: data,
        });

        return;
      }

      set({ error: 'Erro ao atualizar turma.' });
      throw error;
    }
  },

  removeClass: async (id: string) => {
    set({ error: null });

    try {
      const schoolIdFromState = get().classes.find((classItem) => classItem.id === id)?.schoolId;

      await classService.delete(id);
      set((state) => {
        const nextClasses = state.classes.filter((classItem) => classItem.id !== id);
        if (schoolIdFromState) {
          void writeOfflineItem(classCacheKey(schoolIdFromState), nextClasses);
        }
        return { classes: nextClasses };
      });

      if (schoolIdFromState) {
        await updateSchoolCountInCache(schoolIdFromState, -1);
      }

      await syncOfflineOutbox();
    } catch (error) {
      if (isLikelyNetworkError(error)) {
        const schoolIdFromState = get().classes.find((classItem) => classItem.id === id)?.schoolId;

        set((state) => {
          const nextClasses = state.classes.filter((classItem) => classItem.id !== id);
          if (schoolIdFromState) {
            void writeOfflineItem(classCacheKey(schoolIdFromState), nextClasses);
          }
          return { classes: nextClasses, error: null };
        });

        if (schoolIdFromState) {
          await updateSchoolCountInCache(schoolIdFromState, -1);
        }

        await enqueueOfflineOperation({
          entity: 'class',
          action: 'delete',
          targetId: id,
        });

        return;
      }

      set({ error: 'Erro ao remover turma.' });
      throw error;
    }
  },
}));
