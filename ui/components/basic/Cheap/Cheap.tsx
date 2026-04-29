import { styles as cheapStyles } from '@/ui/components/basic/Cheap/Cheap.style';
import { CustomIcon, type IoniconsName } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import type { FC } from 'react';
import { View } from 'react-native';

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
