import { UserProfileView } from '@clerk/expo/native';
import { styles } from '@/features/profile/ui/pages/AccountSettingsPage/AccountSettingsPage.style';

export const AccountSettingsPage = () => {
  return <UserProfileView style={styles.container} isDismissible={false} />;
};
