export const MeasurementUnit = {
  Millisecond: 'millisecond',
  Second: 'second',
  Byte: 'byte',
  None: 'none',
} as const;

export type MeasurementUnit = (typeof MeasurementUnit)[keyof typeof MeasurementUnit];
