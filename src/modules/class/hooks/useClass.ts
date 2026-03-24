import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useSchoolStore } from '../../school/stores/schoolStore';
import { useDebouncedValue } from '../../shared/utils/useDebouncedValue';
import { ClassItem, useClassStore } from '../stores/classStore';

export function useClass() {
  const router = useRouter();
  const params = useLocalSearchParams<{ schoolId?: string | string[] }>();
  const schoolId = Array.isArray(params.schoolId) ? params.schoolId[0] : params.schoolId;

  const { classes, isLoading, error, fetchClasses, removeClass } = useClassStore();
  const { schools, fetchSchools } = useSchoolStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 450);

  const schoolName = schools.find((school) => school.id === schoolId)?.name;

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

  const handleDeletePress = (classItem: ClassItem) => {
    Alert.alert('Remover turma', `Deseja remover ${classItem.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void removeClass(classItem.id);
        },
      },
    ]);
  };

  const handleGoBack = () => {
    router.back();
  };

  return {
    classes,
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
