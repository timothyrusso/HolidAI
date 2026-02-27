import type { StyleProp, TextStyle } from 'react-native';
import { View } from 'react-native';

import { CustomIconButtonSmall } from '@/ui/components/basic/CustomIconButton/CustomIconButtonSmall';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';

import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { styles } from './ModalTemplateHeader.style';

const ModalHeader = ({
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

export default ModalHeader;
