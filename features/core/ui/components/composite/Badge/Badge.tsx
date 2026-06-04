import { CustomIcon } from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
import { CustomImage } from '@/features/core/ui/components/basic/CustomImage/CustomImage';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { styles as badgeStyle } from '@/features/core/ui/components/composite/Badge/Badge.style';
import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { icons } from '@/features/core/ui/style/icons';
import type { FC } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { View } from 'react-native';

type BadgeProps = {
  label: string;
  image: ImageSourcePropType;
  backgroundColor: string;
  active: boolean;
};

export const Badge: FC<BadgeProps> = ({ label, image, backgroundColor, active }) => {
  const styles = badgeStyle(active, backgroundColor);

  return (
    <View style={styles.container}>
      <View style={styles.circleWrapper}>
        <View style={styles.circle}>
          <CustomImage source={image} style={styles.badgeImage} />
        </View>
        <View style={styles.checkBadge}>
          <CustomIcon
            name={active ? icons.success : icons.closeCircle}
            size={spacing.TripleAndHalf}
            color={active ? colors.tertiaryGreen : colors.primaryRed}
          />
        </View>
      </View>
      <CustomText text={label.toLocaleUpperCase()} style={styles.label} />
    </View>
  );
};
