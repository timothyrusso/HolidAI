import { StyleSheet, View } from 'react-native';
import { Custom3DButton } from '@/features/core/ui';
import { UpcomingTripPage } from '@/features/trips/pages';

// ── TEMPORARY (issue #394) ─────────────────────────────────────────────────
// Throwaway demo of our <Custom3DButton> (NEW) in its STANDARD state, kept for
// an upcoming Android test. Delete this whole block — the handler, the style
// below, the overlay <View>, and the Custom3DButton import — once done.
const handleNewPress = () => {
  // biome-ignore lint/suspicious/noConsole: temporary issue-394 comparison demo
  console.log('[issue-394] NEW (custom) pressed');
};

const demoStyles = StyleSheet.create({
  newButton: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
  },
});
// ───────────────────────────────────────────────────────────────────────────

export default function HomePageTab() {
  return (
    <View style={styles.root}>
      <UpcomingTripPage />
      {/* TEMPORARY (issue #394) — remove with the demo constants above. */}
      <View style={demoStyles.newButton}>
        <Custom3DButton onPress={handleNewPress}>NEW</Custom3DButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
