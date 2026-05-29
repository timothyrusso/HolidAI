import type { StyleProp, TextStyle } from 'react-native';
import { View } from 'react-native';

import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { icons } from '@/features/core/ui/style/icons';

import { ButtonType } from '@/features/core/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIconButtonMedium } from '@/features/core/ui/components/basic/CustomIconButton/CustomIconButtonMedium';
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
      {title && <CustomText style={titleStyle ? titleStyle : styles.title} text={title} />}
      {!preventClosing && (
        <CustomIconButtonMedium
          iconName={icons.close}
          buttonType={ButtonType.Quaternary}
          onPress={() => {
            if (action) action();
          }}
        />
      )}
    </View>
  );
};
