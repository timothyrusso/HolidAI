import { useUserRepository } from '@/features/user/data/repositories/useUserRepository';

export const useGetUser = () => {
  const repo = useUserRepository();
  return { user: repo.getUser() };
};
