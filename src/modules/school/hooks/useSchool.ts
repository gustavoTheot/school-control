import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { useDebouncedValue } from '../../shared/utils/useDebouncedValue';
import { showErrorToast, showSuccessToast } from '../../shared/utils/toast';
import { useSchoolStore } from '../stores/schoolStore';
import { School } from '../types/schoolDto';

export function useSchool() {
  const router = useRouter();
  const { schools, isLoading, error, fetchSchools, removeSchool } = useSchoolStore();

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
    router.push(`/school/${schoolId}`);
  };

  const handleDeletePress = (school: School) => {
    Alert.alert('Remover escola', `Deseja remover ${school.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeSchool(school.id);
            showSuccessToast('Escola removida', 'A escola foi removida com sucesso.');
          } catch {
            showErrorToast('Falha ao remover', 'Nao foi possivel remover a escola.');
          }
        },
      },
    ]);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleViewClasses = (schoolId: string) => {
    router.push(`/class/${schoolId}`);
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
