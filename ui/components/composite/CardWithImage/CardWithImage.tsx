import { CustomImage } from '@/ui/components/basic/CustomImage/CustomImage';
import type { FC } from 'react';
import { View } from 'react-native';
import CustomText from '../../basic/CustomText/CustomText';
import { style } from './CardWithImage.style';

type CardWithImageProps = {
  title: string;
  description: string;
  icon?: string;
  image?: string;
};
const CardWithImage: FC<CardWithImageProps> = ({ title, description, icon, image }) => {
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

export default CardWithImage;
