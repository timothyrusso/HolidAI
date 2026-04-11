import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { View } from 'react-native';
import { styles } from './HomeSkeleton.style';

export const HomeSkeleton = () => {
  return (
    <BaseSkeleton style={styles.container}>
      <View style={styles.box} />
    </BaseSkeleton>
  );
};
