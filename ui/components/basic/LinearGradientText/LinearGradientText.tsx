import { spacing } from '@/ui/style/dimensions/spacing';
import MaskedView from '@react-native-masked-view/masked-view';
import type { FC } from 'react';
import type { ImageSourcePropType, StyleProp, TextStyle } from 'react-native';
import { Image, View } from 'react-native';
import CustomText from '../CustomText/CustomText';
import { styles as stylesFactory } from './LinearGradientText.style';

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
      <Image source={imageSource} style={styles.image} />
    </MaskedView>
  );
};
