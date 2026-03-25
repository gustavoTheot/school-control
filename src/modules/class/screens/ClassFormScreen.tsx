import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClassFormActions } from '../components/ClassFormActions';
import { ClassFormFields } from '../components/ClassFormFields';
import { useClassForm } from '../hooks/useClassForm';

export default function ClassFormScreen() {
  const {
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
  } = useClassForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{isEditing ? 'Editar Turma' : 'Nova Turma'}</Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? `Atualize os dados da turma de ID: ${classId}`
            : 'Preencha os dados para cadastrar uma nova turma.'}
        </Text>
        <Text style={styles.schoolInfo}>
          {`Escola vinculada: ${schoolName || 'Carregando escola...'}`}
        </Text>

        <ClassFormFields
          name={name}
          setName={setName}
          shift={shift}
          setShift={setShift}
          schoolYearText={schoolYearText}
          setSchoolYearText={setSchoolYearText}
          errors={errors}
          setErrors={setErrors}
        />

        {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

        <ClassFormActions
          isLoadingSaving={isLoadingSaving}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 8,
    color: '#64748b',
    fontWeight: '500',
  },
  schoolInfo: {
    marginTop: 6,
    color: '#475569',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 6,
    color: '#b91c1c',
    fontWeight: '600',
  },
});
