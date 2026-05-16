import { styles as cheapStyles } from '@/features/core/ui/components/basic/Cheap/Cheap.style';
import { CustomIcon, type IoniconsName } from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
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
