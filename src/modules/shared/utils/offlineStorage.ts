import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readOfflineItem<T>(key: string): Promise<T | null> {
  try {
    const rawValue = await AsyncStorage.getItem(key);
    if (!rawValue) return null;
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export async function writeOfflineItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore to avoid breaking app flow when local storage is unavailable.
  }
}

export async function removeOfflineItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Silently ignore to avoid breaking app flow when local storage is unavailable.
  }
}
