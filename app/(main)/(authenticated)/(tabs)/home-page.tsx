import { StyleSheet, View } from 'react-native';
import { Custom3DButton } from '@/features/core/ui';
import { UpcomingTripPage } from '@/features/trips/pages';

// ── TEMPORARY (issue #394) ─────────────────────────────────────────────────
// Throwaway Custom3DButton validation demo. Delete this whole block — the
// styles below, the overlay <View>, and the extra imports — once validated.
const handleDemoPress = () => {
  // biome-ignore lint/suspicious/noConsole: temporary issue-394 demo feedback, removed with the demo block
  console.log('[issue-394] Custom3DButton pressed');
};

const demoStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 48,
    gap: 12,
  },
});
// ───────────────────────────────────────────────────────────────────────────

export default function HomePageTab() {
  return (
    <View style={styles.root}>
      <UpcomingTripPage />
      {/* TEMPORARY (issue #394) — remove with the demo constants above. */}
      <View style={demoStyles.overlay} pointerEvents="box-none">
        <Custom3DButton onPress={handleDemoPress}>PRIMARY</Custom3DButton>
        <Custom3DButton onPress={handleDemoPress} disabled>
          DISABLED
        </Custom3DButton>
        <Custom3DButton onPress={handleDemoPress} isLoading>
          LOADING
        </Custom3DButton>
        <Custom3DButton onPress={handleDemoPress} leftIcon="airplane" rightIcon="arrow-forward">
          ICONS
        </Custom3DButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
