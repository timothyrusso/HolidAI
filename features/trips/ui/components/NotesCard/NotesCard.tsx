import { CustomIcon, type IoniconsName } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { type FC, Fragment } from 'react';
import { View } from 'react-native';
import { styles as stylesFactory } from './NotesCard.style';

type NotesCardProps = {
  title: string;
  icon: IoniconsName;
  notes: string;
  backgroundColor?: string;
  isTitleInverted?: boolean;
};

export const NotesCard: FC<NotesCardProps> = ({
  title,
  icon,
  notes,
  backgroundColor = colors.secondaryGrey,
  isTitleInverted = false,
}) => {
  const styles = stylesFactory(isTitleInverted);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        {isTitleInverted ? (
          <Fragment>
            <CustomText text={title} style={styles.title} />
            <CustomIcon name={icon} size={spacing.Triple} />
          </Fragment>
        ) : (
          <Fragment>
            <CustomIcon name={icon} size={spacing.Triple} />
            <CustomText text={title} style={styles.title} />
          </Fragment>
        )}
      </View>
      <CustomText text={notes} style={styles.notes} />
    </View>
  );
};
