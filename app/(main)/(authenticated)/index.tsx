import { Redirect } from 'expo-router';
import { Routes } from '@/features/core/navigation';

export default function Index() {
  return <Redirect href={`/${Routes.HomePage}`} />;
}
