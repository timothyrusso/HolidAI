import type { TripAiResp } from '@/features/trips/domain/entities/Trip';

export type DayPlan = TripAiResp['dayPlans'][number];
