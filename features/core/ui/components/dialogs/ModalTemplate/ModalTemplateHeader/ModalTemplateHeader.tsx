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
  children,
}: {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  action: () => void;
  preventClosing?: boolean;
  children?: React.ReactElement;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {title && <CustomText style={titleStyle ? titleStyle : styles.title} text={title} />}
        {children}
      </View>
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
