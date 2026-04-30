import { useHeaderIconsLogic } from '@/features/trips/ui/components/HeaderIcons/HeaderIcons.logic';
import { heartPulseStyle, styles } from '@/features/trips/ui/components/HeaderIcons/HeaderIcons.style';
import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIconButtonLarge } from '@/ui/components/basic/CustomIconButton/CustomIconButtonLarge';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { View } from 'react-native';

export const HeaderIcons = () => {
  const { goBackHandler, addToFavoritesHandler, handleDeleteTrip, isFavorite, shouldAnimate } = useHeaderIconsLogic();

  return (
    <View style={styles.container}>
      <CustomIconButtonLarge
        iconName={icons.arrowBack}
        iconSize={spacing.Fourfold}
        onPress={goBackHandler}
        style={styles.backIcon}
        buttonType={ButtonType.Tertiary}
      />
      <CustomIconButtonLarge
        iconName={!isFavorite ? icons.hearth : icons.heartOutline}
        iconSize={spacing.Fourfold}
        onPress={addToFavoritesHandler}
        style={styles.favoriteIcon}
        buttonType={ButtonType.Tertiary}
        animatedIconStyle={shouldAnimate ? heartPulseStyle : undefined}
        noPressedStyle
      />
      <CustomIconButtonLarge
        iconName={icons.remove}
        iconSize={spacing.Fourfold}
        onPress={handleDeleteTrip}
        style={styles.removeIcon}
        buttonType={ButtonType.Tertiary}
      />
    </View>
  );
};
