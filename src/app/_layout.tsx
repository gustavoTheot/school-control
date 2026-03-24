import '../styles/global.css'
import { useEffect } from 'react';
import axios from 'axios';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useColorScheme } from '../hooks/use-color-scheme';
import { makeServer } from '../mocks/server';
import { refreshOfflineSyncState, syncOfflineOutbox } from '../modules/shared/utils/offlineSync';

let isServerStarted = false;

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (__DEV__ && !isServerStarted) {
      makeServer();
      isServerStarted = true;
    }

    axios.defaults.baseURL = '/api';

    void refreshOfflineSyncState();
    void syncOfflineOutbox();

    const syncInterval = setInterval(() => {
      void syncOfflineOutbox();
    }, 10000);

    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="index" 
          />
          <Stack.Screen name="school/index" />
          <Stack.Screen 
            name="school/form" 
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="class/index" />
          <Stack.Screen 
            name="class/form" 
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="sync/index" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}