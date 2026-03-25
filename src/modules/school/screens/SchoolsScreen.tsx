import { ChevronLeft, Pencil, Search, Trash2 } from 'lucide-react-native';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSchool } from '../hooks/useSchool';

export default function SchoolsScreen() {
  const {
    schools,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleDeletePress,
    handleEditPress,
    handleNavigateToNewSchool,
    handleGoBack,
    handleViewClasses,
  } = useSchool();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.8}>
            <ChevronLeft size={20} color="#1d4ed8" />
          </TouchableOpacity>
          <Text style={styles.backText}>Voltar</Text>
        </View>

        <Text style={styles.title}>Escolas</Text>

        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nome ou endereco"
            style={styles.searchInput}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {isLoading ? (
          <View style={styles.centerBox}>
            <Text style={styles.secondaryText}>Carregando escolas...</Text>
          </View>
        ) : (
          <FlatList
            data={schools}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centerBox}>
                <Text style={styles.secondaryText}>Nenhuma escola encontrada.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleViewClasses(item.id)}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.rowActions}>
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();
                        handleEditPress(item.id);
                      }}
                      style={styles.iconButton}
                    >
                      <Pencil size={16} color="#0f172a" />
                    </Pressable>
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();
                        handleDeletePress(item);
                      }}
                      style={styles.iconButton}
                    >
                      <Trash2 size={16} color="#b91c1c" />
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.address}>{item.address}</Text>

                <View style={styles.classCountRow}>
                  <Text style={styles.classCountLabel}>Turmas:</Text>
                  <Text style={styles.classCountValue}>{item.number_of_classes}</Text>
                  <Pressable
                    style={styles.classesLinkButton}
                    onPress={(event) => {
                      event.stopPropagation();
                      handleViewClasses(item.id);
                    }}
                  >
                    <Text style={styles.classesLinkText}>Ver Turmas</Text>
                  </Pressable>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={handleNavigateToNewSchool}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+ Nova Escola</Text>
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
