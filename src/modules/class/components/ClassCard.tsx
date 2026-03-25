import { Pencil, Trash2 } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Class } from '../types/classDto';
import { formatShiftPtBr } from '../utils/formatShiftPtBr';

type ClassCardProps = {
  classItem: Class;
  onEdit: (classId: string) => void;
  onDelete: (classItem: Class) => void;
};

export function ClassCard({ classItem, onEdit, onDelete }: ClassCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>{classItem.name}</Text>
        <View style={styles.rowActions}>
          <TouchableOpacity onPress={() => onEdit(classItem.id)} style={styles.iconButton}>
            <Pencil size={16} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(classItem)} style={styles.iconButton}>
            <Trash2 size={16} color="#b91c1c" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.metaText}>Turno: {formatShiftPtBr(classItem.shift)}</Text>
      <Text style={styles.metaText}>Ano Letivo: {classItem.school_year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  metaText: {
    color: '#475569',
    marginTop: 2,
  },
});
