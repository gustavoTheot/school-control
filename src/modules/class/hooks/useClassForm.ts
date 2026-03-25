import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isAxiosError } from 'axios';

import { useSchoolStore } from '../../school/stores/schoolStore';
import { showErrorToast, showSuccessToast } from '../../shared/utils/toast';
import { useClassStore } from '../stores/classStore';
import { CreateClass } from '../types/classDto';

type FormErrors = {
  name?: string;
  shift?: string;
  school_year?: string;
  general?: string;
};

const shifts: CreateClass['shift'][] = ['morning', 'afternoon', 'evening'];

export function useClassForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; schoolId?: string | string[] }>();
  const classId = useMemo(() => {
    if (!params.id) return undefined;
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);
  const schoolId = useMemo(() => {
    if (!params.schoolId) return undefined;
    return Array.isArray(params.schoolId) ? params.schoolId[0] : params.schoolId;
  }, [params.schoolId]);

  const isEditing = !!classId;
  const { classes, addClass, updateClass, fetchClasses, error: classStoreError } = useClassStore();
  const { schools, fetchSchools } = useSchoolStore();
  
  const schoolName = schools.find((school) => school.id === schoolId)?.name;

  const [name, setName] = useState('');
  const [shift, setShift] = useState<CreateClass['shift']>('morning');
  const [schoolYearText, setSchoolYearText] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoadingSaving, setIsLoadingSaving] = useState(false);

  useEffect(() => {
    if (!schoolId) {
      router.replace('/school');
      return;
    }

    if (!schoolName) {
      void fetchSchools();
    }

    if (!isEditing || !classId) return;

    const selected = classes.find((classItem) => classItem.id === classId);
    if (selected) {
      setName(selected.name);
      setShift(selected.shift);
      setSchoolYearText(String(selected.school_year));
      return;
    }

    void fetchClasses(schoolId);
  }, [classId, classes, fetchClasses, fetchSchools, isEditing, router, schoolId, schoolName]);

  const validate = () => {
    const nextErrors: FormErrors = {};
    const parsedYear = Number(schoolYearText);

    if (!name.trim()) {
      nextErrors.name = 'Informe o nome da turma.';
    }

    if (!shifts.includes(shift)) {
      nextErrors.shift = 'Selecione um turno valido.';
    }

    if (!Number.isInteger(parsedYear)) {
      nextErrors.school_year = 'Informe um ano valido.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!schoolId) {
      setErrors({ general: 'Escola nao informada para cadastro da turma.' });
      return;
    }

    if (!validate()) return;

    setIsLoadingSaving(true);
    setErrors({});

    try {
      const payload: CreateClass = {
        schoolId,
        name: name.trim(),
        shift,
        school_year: Number(schoolYearText),
      };

      if (isEditing && classId) {
        await updateClass(classId, payload);
        showSuccessToast('Turma atualizada', 'As informacoes da turma foram atualizadas.');
      } else {
        await addClass(payload);
        showSuccessToast('Turma criada', 'Nova turma cadastrada com sucesso.');
      }

      router.back();
    } catch (error) {
      const apiMessage =
        isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : null;

      showErrorToast('Falha ao salvar', apiMessage || classStoreError || 'Nao foi possivel salvar a turma.');

      setErrors({ general: apiMessage || classStoreError || 'Não foi possível salvar a turma.' });
    } finally {
      setIsLoadingSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    isEditing,
    classId,
    schoolName,
    name,
    setName,
    shift,
    setShift,
    schoolYearText,
    setSchoolYearText,
    errors,
    setErrors,
    isLoadingSaving,
    handleSave,
    handleCancel,
  };
}
