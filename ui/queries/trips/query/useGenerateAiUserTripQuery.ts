import { AiModels } from '@/configs/ai/AiModels';
import { generatedTripSchema } from '@/modules/trip/domain/entities/GenerateTripSchema';
import { useVercelAi } from '@/ui/hooks/useVercelAi';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { QueryOptionKeys } from '../../QueryOptionKeys';
import { tripsKeys } from '../TripsKeys';

export const useGenerateAiUserTripQuery = (prompt: string) => {
  const { user } = useUser();
  const { generateAiObject } = useVercelAi();

  const { data, isLoading } = useQuery({
    queryKey: [tripsKeys.generateAiUserTrip],
    queryFn: () => generateAiObject<typeof generatedTripSchema>(prompt, generatedTripSchema, AiModels.GEMINI_2_0_FLASH),
    enabled: !!user,
    staleTime: QueryOptionKeys.STALE_TIME,
    gcTime: QueryOptionKeys.GC_TIME,
  });

  return { data, isLoading };
};
