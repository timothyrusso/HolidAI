import { Fragment } from 'react';
import { View } from 'react-native';

import { BlurSurface } from '@/features/core/design-system/components/basic/CustomBlurButton/BlurSurface';
import {
  type CustomChipProps,
  useCustomChipLogic,
} from '@/features/core/design-system/components/basic/CustomChip/CustomChip.logic';
import { styleChip } from '@/features/core/design-system/components/basic/CustomChip/CustomChip.style';
import { CustomIcon } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/features/core/design-system/components/basic/CustomText/CustomText';

export const CustomChip = (props: CustomChipProps) => {
  const { derived } = useCustomChipLogic(props);

  const { title, icon, accessibilityLabel, uppercase = true, style } = props;

  const styles = styleChip({
    chipSize: derived.chipSize,
    chipColors: derived.chipColors,
    isIconOnly: derived.isIconOnly,
  });

  return (
    <View
      style={[styles.container, style]}
      accessible={derived.isAccessibilityElement}
      accessibilityLabel={accessibilityLabel}
    >
      {derived.isBlur && (
        <Fragment>
          <BlurSurface
            intensity={derived.intensity}
            canBlur={derived.canBlur}
            surfaceStyle={styles.surface}
            maskStyle={styles.mask}
            blurTargetRef={props.blurTargetRef}
          >
            <View style={styles.tint} />
          </BlurSurface>
          <View style={styles.border} />
        </Fragment>
      )}
      {icon && (
        <View
          aria-hidden={derived.isIconDecorative}
          accessibilityElementsHidden={derived.isIconDecorative}
          importantForAccessibility={derived.isIconDecorative ? 'no-hide-descendants' : 'auto'}
        >
          <CustomIcon name={icon} size={derived.chipSize.iconSize} color={derived.chipColors.content} />
        </View>
      )}
      {title !== undefined && (
        <CustomText
          text={title}
          style={[styles.title, uppercase && styles.titleUppercase]}
          numberOfLines={1}
          ellipsizeMode="tail"
        />
      )}
    </View>
  );
};
