import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles as headerStyles } from './HomeCustomHeader.style';
export const useHomeCustomHeaderLogic = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const styles = headerStyles(top);

  const handleShowAllTrips = () => router.push({ pathname: `/${Stacks.MyTrips}/${Routes.ShowAllTrips}` });

  return { styles, handleShowAllTrips };
};
