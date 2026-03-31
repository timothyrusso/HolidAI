import type { NavigationHref } from '@/features/core/navigation';
import type { ErrorBoundaryProps } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useGenericCrashViewLogic } from './GenericCrashView.logic';
import { styles } from './GenericCrashView.style';

type GenericCrashViewProps = ErrorBoundaryProps & {
  redirectTo: NavigationHref;
};

export const GenericCrashView = (props: GenericCrashViewProps) => {
  const { message, handleRetry, t } = useGenericCrashViewLogic(props);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonText}>{t('ERRORS.BUTTONS.TRY_AGAIN')}</Text>
      </Pressable>
    </View>
  );
};
