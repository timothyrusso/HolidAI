import { Routes } from '@/modules/navigation/domain/entities/routes';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={`/${Routes.MyTrips}`} />;
}
