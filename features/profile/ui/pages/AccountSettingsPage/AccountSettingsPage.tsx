import { styles } from '@/features/profile/ui/pages/AccountSettingsPage/AccountSettingsPage.style';
import { UserProfileView } from '@clerk/expo/native';

export const AccountSettingsPage = () => {
  return <UserProfileView style={styles.container} isDismissible={false} />;
};
