import { ChevronLeft, Pencil, Search, Trash2 } from 'lucide-react-native';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useOfflineSyncStore } from '../../shared/stores/offlineSyncStore';
import { useClass } from '../hooks/useClass';

export default function ClassesScreen() {
  const router = useRouter();
  const { pendingCount, isSyncing } = useOfflineSyncStore();

  const {
    classes,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleDeletePress,
    handleEditPress,
    handleNavigateToNewClass,
    handleGoBack,
    schoolName,
  } = useClass();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.8}>
            <ChevronLeft size={20} color="#1d4ed8" />
          </TouchableOpacity>
          <Text style={styles.backText}>Voltar</Text>
        </View>

        <Text style={styles.title}>Turmas</Text>
        <Text style={styles.subtitle}>
          {`Escola vinculada: ${schoolName || 'Carregando escola...'}`}
        </Text>

        <TouchableOpacity
          style={styles.syncBadge}
          activeOpacity={0.85}
          onPress={() => router.push('/sync')}
        >
          <Text style={styles.syncBadgeText}>
            {isSyncing ? 'Sincronizando...' : `Pendencias: ${pendingCount}`}
          </Text>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nome da turma"
            style={styles.searchInput}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {isLoading ? (
          <View style={styles.centerBox}>
            <Text style={styles.secondaryText}>Carregando turmas...</Text>
          </View>
        ) : (
          <FlatList
            data={classes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centerBox}>
                <Text style={styles.secondaryText}>Nenhuma turma encontrada.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.rowActions}>
                    <TouchableOpacity onPress={() => handleEditPress(item.id)} style={styles.iconButton}>
                      <Pencil size={16} color="#0f172a" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress(item)} style={styles.iconButton}>
                      <Trash2 size={16} color="#b91c1c" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.metaText}>Turno: {item.shift}</Text>
                <Text style={styles.metaText}>Ano Letivo: {item.school_year}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={handleNavigateToNewClass} activeOpacity={0.85}>
          <Text style={styles.fabText}>+ Nova Turma</Text>
        </TouchableOpacity>
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
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    marginLeft: 10,
    color: '#1d4ed8',
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    color: '#0f172a',
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 6,
    color: '#475569',
    fontWeight: '600',
  },
  syncBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
  },
  syncBadgeText: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 12,
  },
  searchBox: {
    marginTop: 10,
    marginBottom: 8,
    height: 46,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
  },
  listContent: {
    paddingBottom: 140,
    paddingTop: 6,
    gap: 10,
  },
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  centerBox: {
    alignItems: 'center',
    marginTop: 28,
  },
  secondaryText: {
    color: '#475569',
    fontWeight: '600',
  },
  errorText: {
    color: '#b91c1c',
    marginTop: 6,
    fontWeight: '600',
  },
});
