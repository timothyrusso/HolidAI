import { useRootAppCrashViewLogic } from '@/ui/components/errors/RootAppCrashView/RootAppCrashView.logic';
import { styles } from '@/ui/components/errors/RootAppCrashView/RootAppCrashView.style';
import type { ErrorBoundaryProps } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export const RootAppCrashView = (props: ErrorBoundaryProps) => {
  const { message, retry, t } = useRootAppCrashViewLogic(props);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={retry}>
        <Text style={styles.buttonText}>{t('ERRORS.BUTTONS.TRY_AGAIN')}</Text>
      </Pressable>
    </View>
  );
};
