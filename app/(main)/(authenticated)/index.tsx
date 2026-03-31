import { Routes } from '@/features/core/navigation';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={`/${Routes.HomePage}`} />;
}
