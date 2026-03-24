import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useOfflineSyncStore } from '../stores/offlineSyncStore';
import { getOfflineOutboxSnapshot, OfflineOperation, refreshOfflineSyncState, syncOfflineOutbox } from '../utils/offlineSync';

const formatDateTime = (timestamp: number | null) => {
  if (!timestamp) return 'Nunca';
  return new Date(timestamp).toLocaleString('pt-BR');
};

export default function SyncStatusScreen() {
  const router = useRouter();
  const { pendingCount, isSyncing, lastSyncedAt, lastError } = useOfflineSyncStore();
  const [operations, setOperations] = useState<OfflineOperation[]>([]);

  const loadStatus = useCallback(async () => {
    await refreshOfflineSyncState();
    const outbox = await getOfflineOutboxSnapshot();
    setOperations(outbox.sort((a, b) => a.createdAt - b.createdAt));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadStatus();
    }, [loadStatus]),
  );

  const handleSyncNow = async () => {
    await syncOfflineOutbox();
    await loadStatus();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sincronizacao Offline</Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusText}>Pendentes: {pendingCount}</Text>
          <Text style={styles.statusText}>Ultima sync: {formatDateTime(lastSyncedAt)}</Text>
          <Text style={[styles.statusText, lastError ? styles.errorText : undefined]}>
            {lastError ? `Erro: ${lastError}` : 'Sem erros de sincronizacao.'}
          </Text>

          <TouchableOpacity
            onPress={handleSyncNow}
            disabled={isSyncing}
            style={[styles.syncButton, isSyncing ? styles.syncButtonDisabled : undefined]}
          >
            {isSyncing ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.syncButtonText}>Sincronizar agora</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Fila de Operacoes</Text>
        <FlatList
          data={operations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma operacao pendente.</Text>}
          renderItem={({ item }) => (
            <View style={styles.operationItem}>
              <Text style={styles.operationTitle}>
                {item.entity.toUpperCase()} - {item.action.toUpperCase()}
              </Text>
              <Text style={styles.operationSubtext}>ID alvo: {item.targetId}</Text>
              <Text style={styles.operationSubtext}>Criado em: {formatDateTime(item.createdAt)}</Text>
            </View>
          )}
        />
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
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  backButton: {
    height: 34,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  statusCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 8,
  },
  statusText: {
    color: '#334155',
    fontWeight: '600',
  },
  errorText: {
    color: '#b91c1c',
  },
  syncButton: {
    marginTop: 8,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonDisabled: {
    opacity: 0.7,
  },
  syncButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  listContent: {
    paddingBottom: 40,
    gap: 10,
  },
  emptyText: {
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  operationItem: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 12,
  },
  operationTitle: {
    color: '#0f172a',
    fontWeight: '800',
  },
  operationSubtext: {
    marginTop: 2,
    color: '#64748b',
  },
});
