import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import type { FC } from 'react';
import { View } from 'react-native';
import { CustomIcon, type IoniconsName } from '../CustomIcon/CustomIcon';
import CustomText from '../CustomText/CustomText';
import { styles as cheapStyles } from './Cheap.style';

type CheapProps = {
  title: string;
  color: string;
  icon?: IoniconsName;
};

export const Cheap: FC<CheapProps> = ({ title, color, icon }) => {
  const styles = cheapStyles(color);
  return (
    <View style={styles.container}>
      {icon && <CustomIcon name={icon} size={spacing.Triple} color={colors.primaryBlack} />}
      <CustomText text={title.toUpperCase()} style={styles.title} />
    </View>
  );
};
