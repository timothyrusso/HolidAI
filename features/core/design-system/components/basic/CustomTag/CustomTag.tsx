import { Fragment } from 'react';
import { View } from 'react-native';

import { BlurSurface } from '@/features/core/design-system/components/basic/CustomBlurButton/BlurSurface';
import { CustomIcon } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import {
  type CustomTagProps,
  useCustomTagLogic,
} from '@/features/core/design-system/components/basic/CustomTag/CustomTag.logic';
import { styleTag } from '@/features/core/design-system/components/basic/CustomTag/CustomTag.style';
import { CustomText } from '@/features/core/design-system/components/basic/CustomText/CustomText';

export const CustomTag = (props: CustomTagProps) => {
  const { derived } = useCustomTagLogic(props);

  const { title, icon, accessibilityLabel, uppercase = true } = props;

  const styles = styleTag({
    tagSize: derived.tagSize,
    tagColors: derived.tagColors,
    isIconOnly: derived.isIconOnly,
  });

  return (
    <View style={styles.container} accessible={derived.isAccessibilityElement} accessibilityLabel={accessibilityLabel}>
      {derived.isBlur ? (
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
          {/* An overlay, because a 50%-opacity border cannot be drawn without fading the content with it. */}
          <View style={styles.blurBorder} />
        </Fragment>
      ) : (
        // Also an overlay: a border on the container would eat 1px out of the symmetric padding an
        // icon-only tag needs to stay square around its icon.
        <View style={styles.solidBorder} />
      )}
      {icon && (
        <View
          aria-hidden={derived.isIconDecorative}
          accessibilityElementsHidden={derived.isIconDecorative}
          importantForAccessibility={derived.isIconDecorative ? 'no-hide-descendants' : 'auto'}
        >
          <CustomIcon name={icon} size={derived.tagSize.iconSize} color={derived.tagColors.content} />
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
