import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';

export interface DayPlan {
  schedule: ScheduleItem[];
  day: number;
  theme: string;
}
