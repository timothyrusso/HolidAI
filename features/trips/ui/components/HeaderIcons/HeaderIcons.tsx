import { ButtonType, CustomIconButtonMedium, icons, spacing } from '@/features/core/ui';
import { useHeaderIconsLogic } from '@/features/trips/ui/components/HeaderIcons/HeaderIcons.logic';
import { heartPulseStyle, styles } from '@/features/trips/ui/components/HeaderIcons/HeaderIcons.style';
import { View } from 'react-native';

export const HeaderIcons = () => {
  const { goBackHandler, addToFavoritesHandler, handleDeleteTrip, isFavorite, shouldAnimate } = useHeaderIconsLogic();

  return (
    <View style={styles.container}>
      <CustomIconButtonMedium
        iconName={icons.arrowBack}
        iconSize={spacing.Fourfold}
        onPress={goBackHandler}
        style={styles.backIcon}
        buttonType={ButtonType.Quaternary}
      />
      <CustomIconButtonMedium
        iconName={!isFavorite ? icons.hearth : icons.heartOutline}
        iconSize={spacing.Fourfold}
        onPress={addToFavoritesHandler}
        style={styles.favoriteIcon}
        buttonType={ButtonType.Quaternary}
        animatedIconStyle={shouldAnimate ? heartPulseStyle : undefined}
        noPressedStyle
      />
      <CustomIconButtonMedium
        iconName={icons.remove}
        iconSize={spacing.Fourfold}
        onPress={handleDeleteTrip}
        style={styles.removeIcon}
        buttonType={ButtonType.Quaternary}
      />
    </View>
  );
};
