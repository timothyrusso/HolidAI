import { Routes } from '@/ui/constants/navigation/routes';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={`/${Routes.MyTrips}`} />;
}
