import { CheckCircle2, CircleAlert } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

type AppToastProps = {
  text1?: string;
  text2?: string;
};

function ToastCard({
  title,
  message,
  kind,
}: {
  title: string;
  message?: string;
  kind: 'success' | 'error';
}) {
  const isSuccess = kind === 'success';

  return (
    <View style={[styles.card, isSuccess ? styles.cardSuccess : styles.cardError]}>
      <View style={[styles.iconWrap, isSuccess ? styles.iconWrapSuccess : styles.iconWrapError]}>
        {isSuccess ? (
          <CheckCircle2 size={18} color="#166534" />
        ) : (
          <CircleAlert size={18} color="#991b1b" />
        )}
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.title, isSuccess ? styles.titleSuccess : styles.titleError]}>
          {title}
        </Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  appSuccess: ({ text1, text2 }: AppToastProps) => (
    <ToastCard title={text1 || 'Sucesso'} message={text2} kind="success" />
  ),
  appError: ({ text1, text2 }: AppToastProps) => (
    <ToastCard title={text1 || 'Erro'} message={text2} kind="error" />
  ),
};

const styles = StyleSheet.create({
  card: {
    width: '92%',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  cardSuccess: {
    borderColor: '#86efac',
  },
  cardError: {
    borderColor: '#fca5a5',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSuccess: {
    backgroundColor: '#dcfce7',
  },
  iconWrapError: {
    backgroundColor: '#fee2e2',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 14,
  },
  titleSuccess: {
    color: '#166534',
  },
  titleError: {
    color: '#991b1b',
  },
  message: {
    color: '#334155',
    marginTop: 1,
    fontWeight: '500',
    fontSize: 13,
  },
});
