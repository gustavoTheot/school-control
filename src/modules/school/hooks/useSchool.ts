import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { useDebouncedValue } from '../../shared/utils/useDebouncedValue';
import { SchoolItem, useSchoolStore } from '../stores/schoolStore';

export function useSchool() {
  const router = useRouter();
  const {
    schools,
    isLoading,
    error,
    fetchSchools,
    removeSchool,
  } = useSchoolStore();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 450);

  useEffect(() => {
    void fetchSchools(debouncedSearch.trim() || undefined);
  }, [debouncedSearch, fetchSchools]);

  useFocusEffect(
    useCallback(() => {
      void fetchSchools(debouncedSearch.trim() || undefined);
    }, [debouncedSearch, fetchSchools]),
  );

  const handleNavigateToNewSchool = () => {
    router.push('/school/form');
  };

  const handleEditPress = (schoolId: string) => {
    router.push({ pathname: '/school/form', params: { id: schoolId } });
  };

  const handleDeletePress = (school: SchoolItem) => {
    Alert.alert('Remover escola', `Deseja remover ${school.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void removeSchool(school.id);
        },
      },
    ]);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleViewClasses = (schoolId: string) => {
    router.push({ pathname: '/class', params: { schoolId } });
  };

  return {
    schools,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleDeletePress,
    handleEditPress,
    handleNavigateToNewSchool,
    handleGoBack,
    handleViewClasses,
  };
}
