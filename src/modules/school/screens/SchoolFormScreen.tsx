import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SchoolFormActions } from '../components/SchoolFormActions';
import { SchoolFormFields } from '../components/SchoolFormFields';
import { useSchoolForm } from '../hooks/useSchoolForm';

export default function SchoolFormScreen() {
  const {
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
  } = useSchoolForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{isEditing ? 'Editar Escola' : 'Nova Escola'}</Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? `Atualize os dados da escola de ID: ${schoolId}`
            : 'Preencha os dados para cadastrar uma nova escola.'}
        </Text>

        <SchoolFormFields
          name={name}
          setName={setName}
          address={address}
          setAddress={setAddress}
          errors={errors}
          setErrors={setErrors}
        />

        {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

        <SchoolFormActions
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
  errorText: {
    marginTop: 6,
    color: '#b91c1c',
    fontWeight: '600',
  },
});
