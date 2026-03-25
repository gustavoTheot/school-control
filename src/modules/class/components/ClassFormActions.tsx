import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ClassFormActionsProps = {
  isLoadingSaving: boolean;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export function ClassFormActions({
  isLoadingSaving,
  isEditing,
  onSave,
  onCancel,
}: ClassFormActionsProps) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.primaryButton, isLoadingSaving ? styles.buttonDisabled : null]}
        onPress={onSave}
        activeOpacity={0.85}
        disabled={isLoadingSaving}
      >
        <Text style={styles.primaryButtonText}>
          {isLoadingSaving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, isLoadingSaving ? styles.buttonDisabled : null]}
        onPress={onCancel}
        activeOpacity={0.85}
        disabled={isLoadingSaving}
      >
        <Text style={styles.secondaryButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
