import { BaseSkeleton } from '@/features/core/ui';
import { styles } from '@/features/trips/ui/components/HomeSkeleton/HomeSkeleton.style';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export const HomeSkeleton = () => {
  const { t } = useTranslation();

  return (
    <BaseSkeleton
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={t('ACCESSIBILITY.LOADING')}
      accessibilityState={{ busy: true }}
    >
      <View style={styles.box} />
    </BaseSkeleton>
  );
};
