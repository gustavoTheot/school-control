import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useSchoolStore } from '../stores/schoolStore';

type FormErrors = {
  name?: string;
  address?: string;
  general?: string;
};

export function useSchoolForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const schoolId = useMemo(() => {
    if (!params.id) return undefined;
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const isEditing = !!schoolId;

  const { schools, addSchool, updateSchool, fetchSchools } = useSchoolStore();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoadingSaving, setIsLoadingSaving] = useState(false);

  useEffect(() => {
    if (!isEditing || !schoolId) return;

    const selected = schools.find((school) => school.id === schoolId);
    if (selected) {
      setName(selected.name);
      setAddress(selected.address);
      return;
    }

    void fetchSchools();
  }, [fetchSchools, isEditing, schoolId, schools]);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Informe o nome da escola.';
    }

    if (!address.trim()) {
      nextErrors.address = 'Informe o endereco da escola.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoadingSaving(true);
    setErrors({});

    try {
      const payload = {
        name: name.trim(),
        address: address.trim(),
      };

      if (isEditing && schoolId) {
        await updateSchool(schoolId, payload);
      } else {
        await addSchool(payload);
      }

      router.back();
    } catch {
      setErrors({ general: 'Nao foi possivel salvar a escola.' });
    } finally {
      setIsLoadingSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    isEditing,
    schoolId,
    name,
    setName,
    address,
    setAddress,
    errors,
    setErrors,
    isLoadingSaving,
    handleSave,
    handleCancel,
  };
}
