import type { FC } from 'react';
import { View } from 'react-native';
import { styles as cheapStyles } from '@/features/core/ui/components/basic/Cheap/Cheap.style';
import { CustomIcon, type IoniconsName } from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

type CheapProps = {
  title: string;
  color: string;
  icon?: IoniconsName;
  uppercase?: boolean;
};

export const Cheap: FC<CheapProps> = ({ title, color, icon, uppercase = true }) => {
  const styles = cheapStyles(color);

  return (
    <View style={styles.container}>
      {icon && <CustomIcon name={icon} size={spacing.Triple} color={colors.primaryBlack} />}
      <CustomText text={uppercase ? title.toUpperCase() : title} style={styles.title} />
    </View>
  );
};
