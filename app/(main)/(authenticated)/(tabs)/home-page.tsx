import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Custom3DButton } from '@/features/core/ui';
import { UpcomingTripPage } from '@/features/trips/pages';

// ── TEMPORARY (issue #394) ─────────────────────────────────────────────────
// Throwaway Custom3DButton validation demo. Delete this whole block — the
// styles below, the demo <ScrollView>, and the extra imports — once validated.
const handleDemoPress = () => {
  // biome-ignore lint/suspicious/noConsole: temporary issue-394 demo feedback, removed with the demo block
  console.log('[issue-394] Custom3DButton pressed');
};

// The tab bar floats absolutely (bottom offset 32 + height 60); clear it plus
// a little breathing room so the last demo button stays tappable.
const DEMO_TAB_BAR_CLEARANCE = 108;

const demoStyles = StyleSheet.create({
  home: {
    flex: 2,
  },
  demo: {
    flex: 1,
  },
  demoContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
});
// ───────────────────────────────────────────────────────────────────────────

export default function HomePageTab() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={demoStyles.home}>
        <UpcomingTripPage />
      </View>
      {/* TEMPORARY (issue #394) — remove with the demo constants above. */}
      <ScrollView
        style={demoStyles.demo}
        contentContainerStyle={[demoStyles.demoContent, { paddingBottom: DEMO_TAB_BAR_CLEARANCE + insets.bottom }]}
      >
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
