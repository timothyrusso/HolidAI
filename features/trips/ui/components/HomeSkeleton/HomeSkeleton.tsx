import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { styles } from './HomeSkeleton.style';

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
