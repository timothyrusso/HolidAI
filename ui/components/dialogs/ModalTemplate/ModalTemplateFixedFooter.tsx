import { View } from 'react-native';

import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import { styles } from '@/ui/components/dialogs/ModalTemplate/ModalTemplate.style';

export const ModalFixedFooter = ({
  primaryAction,
  secondaryAction,
  primaryButtonTitle = 'GLOBAL.BUTTON.CONFIRM',
  secondaryButtonTitle = 'GLOBAL.BUTTON.CANCEL',
  isPrimaryButtonLoading = false,
}: {
  primaryAction: () => void;
  secondaryAction?: () => void;
  primaryButtonTitle?: string;
  primaryButtonDisabled?: boolean;
  secondaryButtonTitle?: string;
  preventClosing?: boolean;
  isPrimaryButtonLoading?: boolean;
}) => {
  return (
    <View style={[styles.footer, styles.fixedFooterContainer]}>
      {secondaryAction ? (
        <View style={styles.buttonContainer}>
          <CustomButtonLarge
            title={secondaryButtonTitle}
            onPress={() => {
              if (secondaryAction) secondaryAction();
            }}
            style={styles.button}
            buttonType={ButtonType.Secondary}
          />
        </View>
      ) : null}
      <View style={styles.buttonContainer}>
        <CustomButtonLarge
          title={primaryButtonTitle}
          onPress={primaryAction}
          style={styles.button}
          isLoading={isPrimaryButtonLoading}
        />
      </View>
    </View>
  );
};
