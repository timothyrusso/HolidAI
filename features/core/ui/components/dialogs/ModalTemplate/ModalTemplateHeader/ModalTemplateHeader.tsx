import type { StyleProp, TextStyle } from 'react-native';
import { View } from 'react-native';

import { CustomIconButtonSmall } from '@/features/core/ui/components/basic/CustomIconButton/CustomIconButtonSmall';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { icons } from '@/features/core/ui/style/icons';

import { ButtonType } from '@/features/core/ui/components/basic/CustomButton/CustomButton.logic';
import { styles } from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateHeader/ModalTemplateHeader.style';

export const ModalHeader = ({
  title = '',
  titleStyle = undefined,
  action,
  preventClosing = false,
}: {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  action: () => void;
  preventClosing?: boolean;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        {!preventClosing && (
          <CustomIconButtonSmall
            iconName={icons.close}
            buttonType={ButtonType.Tertiary}
            iconSize={spacing.Fourfold}
            style={styles.cancelIcon}
            onPress={() => {
              if (action) action();
            }}
          />
        )}
      </View>
      {title && <CustomText style={titleStyle ? titleStyle : styles.title} text={title} />}
    </View>
  );
};
