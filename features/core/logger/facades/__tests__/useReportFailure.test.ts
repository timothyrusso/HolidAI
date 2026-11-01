import { act, waitFor } from '@testing-library/react-native';
import { useReportFailure } from '@/features/core/logger/facades/useReportFailure';
import { NoFeatures, renderWithLayer } from '@/features/core/testing';

describe('useReportFailure', () => {
  it('logs the failure an SDK reported as an UnexpectedError, once', async () => {
    const failure = new Error('REQUEST_DENIED');
    const { result, logs, done } = await renderWithLayer(NoFeatures, useReportFailure, undefined);

    await act(async () => result.current(failure));

    await waitFor(() => expect(logs.entries).toHaveLength(1));
    expect(logs.entries[0]).toMatchObject({ level: 'error', message: 'UnexpectedError' });
    await done();
  });
});
