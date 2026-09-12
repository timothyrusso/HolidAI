import { StyleSheet } from 'react-native';
import { BasicView, CustomHeader } from '@/features/core/design-system';
import { Routes } from '@/features/core/navigation';

/**
 * Temporary placeholder for the fourth tab. The Activities feature does not exist yet, so this route
 * renders its own header over an empty body instead of delegating to a feature page — a deliberate
 * exception to the "routes are thin entry points" convention, to be replaced wholesale by
 * `<ActivitiesPage />` once `features/activities` is built.
 *
 * `isFullScreen` keeps BasicView from adding its own Android status-bar padding on top of the inset
 * CustomHeader already applies.
 */
export default function ActivitiesTab() {
  return (
    <BasicView nameView={Routes.Activities} statusBarStyle="dark" isFullScreen viewStyle={styles.view}>
      <CustomHeader title="ACTIVITIES.TITLE" />
    </BasicView>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-start',
  },
});
