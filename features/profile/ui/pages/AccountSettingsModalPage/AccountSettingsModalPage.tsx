import { styles } from '@/features/profile/ui/pages/AccountSettingsModalPage/AccountSettingsModalPage.style';
import { UserProfileView } from '@clerk/expo/native';

export const AccountSettingsModalPage = () => {
  return <UserProfileView style={styles.container} />;
};
