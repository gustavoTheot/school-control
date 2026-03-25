import { Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { School } from '../types/schoolDto';

type SchoolCardProps = {
  school: School;
  onOpenClasses: (schoolId: string) => void;
  onEdit: (schoolId: string) => void;
  onDelete: (school: School) => void;
};

export function SchoolCard({ school, onOpenClasses, onEdit, onDelete }: SchoolCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onOpenClasses(school.id)}
    >
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>{school.name}</Text>
        <View style={styles.rowActions}>
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onEdit(school.id);
            }}
            style={styles.iconButton}
          >
            <Pencil size={16} color="#0f172a" />
          </Pressable>
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onDelete(school);
            }}
            style={styles.iconButton}
          >
            <Trash2 size={16} color="#b91c1c" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.address}>{school.address}</Text>

      <View style={styles.classCountRow}>
        <Text style={styles.classCountLabel}>Turmas:</Text>
        <Text style={styles.classCountValue}>{school.number_of_classes}</Text>
        <Pressable
          style={styles.classesLinkButton}
          onPress={(event) => {
            event.stopPropagation();
            onOpenClasses(school.id);
          }}
        >
          <Text style={styles.classesLinkText}>Ver Turmas</Text>
        </Pressable>
      </View>
    </TouchableOpacity>
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
  address: {
    color: '#475569',
    marginTop: 2,
  },
  classCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  classCountLabel: {
    color: '#334155',
    fontWeight: '700',
  },
  classCountValue: {
    minWidth: 24,
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '800',
  },
  classesLinkButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e7ff',
  },
  classesLinkText: {
    color: '#1e40af',
    fontWeight: '700',
    fontSize: 12,
  },
});
