import { CustomImage } from '@/features/core/ui/components/basic/CustomImage/CustomImage';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { styles as stylesFactory } from '@/features/core/ui/components/basic/LinearGradientText/LinearGradientText.style';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import MaskedView from '@react-native-masked-view/masked-view';
import type { FC } from 'react';
import type { ImageSourcePropType, StyleProp, TextStyle } from 'react-native';
import { View } from 'react-native';

type LinearGradientTextProps = {
  text: string;
  imageSource: ImageSourcePropType | undefined;
  height?: number;
  textStyle?: StyleProp<TextStyle>;
};

export const LinearGradientText: FC<LinearGradientTextProps> = ({
  text,
  imageSource,
  height = spacing.separator160,
  textStyle,
}) => {
  const styles = stylesFactory(height);

  if (!imageSource) return null;

  return (
    <MaskedView
      style={styles.maskedView}
      maskElement={
        <View style={styles.maskElement}>
          <CustomText style={[styles.title, textStyle]} text={text} />
        </View>
      }
    >
      {/* Shows behind the mask, you can put anything here, such as an image */}
      <CustomImage source={imageSource} style={styles.image} useBlur={false} />
    </MaskedView>
  );
};
