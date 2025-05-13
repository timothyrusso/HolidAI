import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIconButtonLarge } from '@/ui/components/basic/CustomIconButton/CustomIconButtonLarge';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import { View } from 'react-native';
import { useHeaderIconsLogic } from './HeaderIcons.logic';
import { styles } from './HeaderIcons.style';

export const HeaderIcons = () => {
  const { goBackHandler, addToFavoritesHandler, handleDeleteTrip, isFavorite } = useHeaderIconsLogic();

  return (
    <View style={styles.container}>
      <CustomIconButtonLarge
        iconName={icons.arrowBack}
        iconSize={spacing.Fourfold}
        onPress={goBackHandler}
        style={styles.backIcon}
        buttonType={ButtonType.Secondary}
      />
      <CustomIconButtonLarge
        iconName={!isFavorite ? icons.hearth : icons.heartOutline}
        iconSize={spacing.Fourfold}
        onPress={addToFavoritesHandler}
        style={styles.favoriteIcon}
        buttonType={ButtonType.Secondary}
      />
      <CustomIconButtonLarge
        iconName={icons.remove}
        iconSize={spacing.Fourfold}
        onPress={handleDeleteTrip}
        style={styles.removeIcon}
        buttonType={ButtonType.Secondary}
      />
    </View>
  );
};
