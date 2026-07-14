import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 2;

export { BudgetOptions } from '@/features/trips/domain/entities/BudgetOptions';
export type { DayPlan } from '@/features/trips/domain/entities/DayPlan';
export type { Food } from '@/features/trips/domain/entities/Food';
export type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';
export type { Trip, TripAiResp } from '@/features/trips/domain/entities/Trip';
export type { TripDetails } from '@/features/trips/domain/entities/TripDetails';
export type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';
export type { UniqueItem } from '@/features/trips/domain/entities/UniqueItem';
export type { Weather } from '@/features/trips/domain/entities/Weather';
export { useAddTrip } from '@/features/trips/facades/useAddTrip';
export { useDeleteAllTrips } from '@/features/trips/facades/useDeleteAllTrips';
export { useGetFavoriteTrips } from '@/features/trips/facades/useGetFavoriteTrips';
export { useGetTrips } from '@/features/trips/facades/useGetTrips';
export { useStartNewTrip } from '@/features/trips/facades/useStartNewTrip';
