import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <Text style={styles.schoolInfo}>{`Escola vinculada: ${schoolName || 'Carregando escola...'}`}</Text>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Nome da Turma *</Text>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Ex: Turma A"
            style={[styles.input, errors.name ? styles.inputError : null]}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Turno *</Text>
          <View style={styles.shiftRow}>
            {(['morning', 'afternoon', 'evening'] as const).map((option) => {
              const active = shift === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.shiftButton, active ? styles.shiftButtonActive : null]}
                  onPress={() => {
                    setShift(option);
                    if (errors.shift) setErrors((prev) => ({ ...prev, shift: undefined }));
                  }}
                >
                  <Text style={[styles.shiftButtonText, active ? styles.shiftButtonTextActive : null]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.shift ? <Text style={styles.errorText}>{errors.shift}</Text> : null}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Ano Letivo *</Text>
          <TextInput
            value={schoolYearText}
            onChangeText={(text) => {
              setSchoolYearText(text.replace(/[^0-9]/g, ''));
              if (errors.school_year) setErrors((prev) => ({ ...prev, school_year: undefined }));
            }}
            keyboardType="number-pad"
            placeholder="Ex: 2026"
            style={[styles.input, errors.school_year ? styles.inputError : null]}
          />
          {errors.school_year ? <Text style={styles.errorText}>{errors.school_year}</Text> : null}
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
  schoolInfo: {
    marginTop: 6,
    color: '#475569',
    fontWeight: '600',
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
  shiftRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shiftButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  shiftButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  shiftButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  shiftButtonTextActive: {
    color: '#ffffff',
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
