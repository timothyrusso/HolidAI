import { CustomIcon, CustomText, type IoniconsName, colors, spacing } from '@/features/core/ui';
import { styles as stylesFactory } from '@/features/trips/ui/components/NotesCard/NotesCard.style';
import { type FC, Fragment } from 'react';
import { View } from 'react-native';

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
