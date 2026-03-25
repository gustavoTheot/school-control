import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CreateClass } from '../types/classDto';
import { formatShiftPtBr } from '../utils/formatShiftPtBr';

type ClassFormErrors = {
  name?: string;
  shift?: string;
  school_year?: string;
};

type ClassFormFieldsProps = {
  name: string;
  setName: (value: string) => void;
  shift: CreateClass['shift'];
  setShift: (value: CreateClass['shift']) => void;
  schoolYearText: string;
  setSchoolYearText: (value: string) => void;
  errors: ClassFormErrors;
  setErrors: Dispatch<SetStateAction<ClassFormErrors & { general?: string }>>;
};

export function ClassFormFields({
  name,
  setName,
  shift,
  setShift,
  schoolYearText,
  setSchoolYearText,
  errors,
  setErrors,
}: ClassFormFieldsProps) {
  return (
    <>
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Nome da Turma *</Text>
        <TextInput
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="Ex: Turma A"
          placeholderTextColor="#64748b"
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
                <Text
                  style={[styles.shiftButtonText, active ? styles.shiftButtonTextActive : null]}
                >
                  {formatShiftPtBr(option)}
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
          placeholderTextColor="#64748b"
          style={[styles.input, errors.school_year ? styles.inputError : null]}
        />
        {errors.school_year ? <Text style={styles.errorText}>{errors.school_year}</Text> : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});
