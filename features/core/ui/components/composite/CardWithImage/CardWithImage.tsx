import { CustomImage } from '@/features/core/ui/components/basic/CustomImage/CustomImage';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { style } from '@/features/core/ui/components/composite/CardWithImage/CardWithImage.style';
import type { FC } from 'react';
import { View } from 'react-native';

type CardWithImageProps = {
  title: string;
  description: string;
  icon?: string;
  image?: string;
};
export const CardWithImage: FC<CardWithImageProps> = ({ title, description, icon, image }) => {
  return (
    <View style={style.container}>
      {icon && <CustomText text={icon} style={style.icon} />}
      {image && <CustomImage source={{ uri: image }} style={style.image} />}
      <View style={style.textContainer}>
        <CustomText text={title} style={style.title} />
        <CustomText text={description} style={style.description} />
      </View>
    </View>
  );
};
