import { CustomIcon, type IoniconsName } from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { styles as badgeStyle } from '@/features/core/ui/components/composite/Badge/Badge.style';
import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { icons } from '@/features/core/ui/style/icons';
import type { FC } from 'react';
import { View } from 'react-native';

type BadgeProps = {
  label: string;
  icon: IoniconsName;
  backgroundColor: string;
  active: boolean;
};

export const Badge: FC<BadgeProps> = ({ label, icon, backgroundColor, active }) => {
  const styles = badgeStyle(active, backgroundColor);

  return (
    <View style={styles.container}>
      <View style={styles.circleWrapper}>
        <View style={[styles.circle, { backgroundColor: active ? backgroundColor : colors.secondaryGrey }]}>
          <CustomIcon name={icon} size={spacing.FourfoldAndHalf} color={colors.primaryWhite} />
        </View>
        <View style={styles.checkBadge}>
          <CustomIcon
            name={active ? icons.success : icons.close}
            size={spacing.TripleAndHalf}
            color={active ? colors.tertiaryGreen : colors.secondaryGrey}
          />
        </View>
      </View>
      <CustomText text={label} style={styles.label} />
    </View>
  );
};
