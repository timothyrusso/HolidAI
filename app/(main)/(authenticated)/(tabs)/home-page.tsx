import { StyleSheet, View } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';
import { Custom3DButton, fontFamily } from '@/features/core/ui';
import { UpcomingTripPage } from '@/features/trips/pages';

// ── TEMPORARY (issue #394) ─────────────────────────────────────────────────
// Throwaway side-by-side comparison: our <Custom3DButton> (NEW) vs the
// react-native-really-awesome-button library (OLD), both in the STANDARD
// state and tuned to the same PRIMARY look. Delete this whole block — the two
// handlers, the styles below, the overlay <View>s, and the AwesomeButton +
// fontFamily imports — once the comparison is done. This branch is NOT merged.
const handleNewPress = () => {
  // biome-ignore lint/suspicious/noConsole: temporary issue-394 comparison demo
  console.log('[issue-394] NEW (custom) pressed');
};

const handleOldPress = () => {
  // biome-ignore lint/suspicious/noConsole: temporary issue-394 comparison demo
  console.log('[issue-394] OLD (library) pressed');
};

const demoStyles = StyleSheet.create({
  newButton: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
  },
  oldButton: {
    position: 'absolute',
    top: 400,
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
      <View style={demoStyles.oldButton}>
        <AwesomeButton
          width={null}
          stretch
          height={41}
          backgroundColor="#000000"
          borderColor="#01C5C0"
          borderRadius={8}
          backgroundDarker="#018B87"
          raiseLevel={6}
          backgroundShadow="transparent"
          textColor="#FFFFFF"
          textSize={14}
          textFontFamily={fontFamily.interBold}
          onPress={handleOldPress}
        >
          OLD
        </AwesomeButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
