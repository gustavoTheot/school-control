import Toast from 'react-native-toast-message';

export function showSuccessToast(title: string, message?: string) {
  Toast.show({
    type: 'appSuccess',
    text1: title,
    text2: message,
    position: 'bottom',
    bottomOffset: 92,
    visibilityTime: 3000,
  });
}

export function showErrorToast(title: string, message?: string) {
  Toast.show({
    type: 'appError',
    text1: title,
    text2: message,
    position: 'bottom',
    bottomOffset: 92,
    visibilityTime: 3600,
  });
}
