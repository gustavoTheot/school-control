import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Nome da Escola *</Text>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Ex: Colegio Nova Geracao"
            style={[styles.input, errors.name ? styles.inputError : null]}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Endereco *</Text>
          <TextInput
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
            }}
            placeholder="Ex: Rua das Flores, 120 - Centro"
            style={[styles.input, errors.address ? styles.inputError : null]}
          />
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
        </View>

        {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, isLoadingSaving ? styles.buttonDisabled : null]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={isLoadingSaving}
          >
            <Text style={styles.primaryButtonText}>
              {isLoadingSaving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, isLoadingSaving ? styles.buttonDisabled : null]}
            onPress={handleCancel}
            activeOpacity={0.85}
            disabled={isLoadingSaving}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
  fieldBlock: {
    marginTop: 18,
  },
  label: {
    marginBottom: 8,
    fontWeight: '700',
    color: '#1e293b',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    marginTop: 6,
    color: '#b91c1c',
    fontWeight: '600',
  },
  actions: {
    marginTop: 26,
    gap: 12,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
