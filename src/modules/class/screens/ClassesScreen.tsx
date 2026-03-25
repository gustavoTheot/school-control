import { ChevronLeft, Search } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClassCard } from '../components/ClassCard';
import { useClass } from '../hooks/useClass';

export default function ClassesScreen() {
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

        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nome da turma"
            placeholderTextColor="#64748b"
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
              <ClassCard classItem={item} onEdit={handleEditPress} onDelete={handleDeletePress} />
            )}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={handleNavigateToNewClass}
          activeOpacity={0.85}
        >
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
