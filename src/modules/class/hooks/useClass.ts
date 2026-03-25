import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useDebouncedValue } from '../../shared/utils/useDebouncedValue';
import { showErrorToast, showSuccessToast } from '../../shared/utils/toast';
import { useSchoolStore } from '../../school/stores/schoolStore';
import { useClassStore } from '../stores/classStore';
import { Class } from '../types/classDto';

export function useClass() {
  const router = useRouter();
  const params = useLocalSearchParams<{ schoolId?: string | string[] }>();
  const schoolId = Array.isArray(params.schoolId) ? params.schoolId[0] : params.schoolId;

  const { classes, isLoading, error, fetchClasses, removeClass } = useClassStore();
  const { schools, fetchSchools } = useSchoolStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 450);

  const schoolName = schools.find((school) => school.id === schoolId)?.name;
  const classesFromCurrentSchool = schoolId
    ? classes.filter((classItem) => classItem.schoolId === schoolId)
    : [];

  useEffect(() => {
    if (!schoolId) {
      router.replace('/school');

      return;
    }

    if (!schoolName) {
      void fetchSchools();
    }
  }, [fetchSchools, router, schoolId, schoolName]);

  useEffect(() => {
    if (!schoolId) return;
    void fetchClasses(schoolId, debouncedSearch.trim() || undefined);
  }, [debouncedSearch, fetchClasses, schoolId]);

  const handleNavigateToNewClass = () => {
    if (!schoolId) return;
    router.push({ pathname: '/class/form', params: { schoolId } });
  };

  const handleEditPress = (classId: string) => {
    if (!schoolId) return;
    router.push({ pathname: '/class/form', params: { id: classId, schoolId } });
  };

  const handleDeletePress = (classItem: Class) => {
    Alert.alert('Remover turma', `Deseja remover ${classItem.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeClass(classItem.id);
            showSuccessToast('Turma removida', 'A turma foi removida com sucesso.');
          } catch {
            showErrorToast('Falha ao remover', 'Nao foi possivel remover a turma.');
          }
        },
      },
    ]);
  };

  const handleGoBack = () => {
    router.back();
  };

  return {
    classes: classesFromCurrentSchool,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleDeletePress,
    handleEditPress,
    handleNavigateToNewClass,
    handleGoBack,
    schoolName,
  };
}
