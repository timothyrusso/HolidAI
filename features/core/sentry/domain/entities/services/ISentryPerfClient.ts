export interface ISentryPerfClient {
  startSpan<T>(options: { name: string; op: string }, callback: () => Promise<T>): Promise<T>;
  setMeasurement(name: string, value: number, unit: string): void;
}
