import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type SchoolFormErrors = {
  name?: string;
  address?: string;
};

type SchoolFormFieldsProps = {
  name: string;
  setName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  errors: SchoolFormErrors;
  setErrors: Dispatch<SetStateAction<SchoolFormErrors & { general?: string }>>;
};

export function SchoolFormFields({
  name,
  setName,
  address,
  setAddress,
  errors,
  setErrors,
}: SchoolFormFieldsProps) {
  return (
    <>
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Nome da Escola *</Text>
        <TextInput
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="Ex: Colegio Nova Geracao"
          placeholderTextColor="#64748b"
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
          placeholderTextColor="#64748b"
          style={[styles.input, errors.address ? styles.inputError : null]}
        />
        {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
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
  errorText: {
    marginTop: 6,
    color: '#b91c1c',
    fontWeight: '600',
  },
});
