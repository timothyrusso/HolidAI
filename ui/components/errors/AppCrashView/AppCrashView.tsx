import type { ErrorBoundaryProps } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useAppCrashViewLogic } from './AppCrashView.logic';
import { styles } from './AppCrashView.style';

export const AppCrashView = (props: ErrorBoundaryProps) => {
  const { message, retry, t } = useAppCrashViewLogic(props);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={retry}>
        + <Text style={styles.buttonText}>{t('ERRORS.BUTTONS.TRY_AGAIN')}</Text>
      </Pressable>
    </View>
  );
};
