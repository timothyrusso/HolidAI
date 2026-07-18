import { View } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';
import { fontFamily } from '@/features/core/ui';
import { UpcomingTripPage } from '@/features/trips/pages';

export default function HomePageTab() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <UpcomingTripPage />
      </View>

      {/* ---------------------------------------------------------------- */}
      {/* TEMPORARY TEST SCAFFOLDING — react-native-really-awesome-button. */}
      {/* Delete this block (and the two imports above) to remove it.      */}
      {/* Tracked in issue #392.                                           */}
      {/* ---------------------------------------------------------------- */}
      <View style={{ padding: 16 }}>
        <AwesomeButton
          width={null}
          stretch
          height={41}
          backgroundColor="#000000"
          borderColor="#01C5C0"
          borderRadius={8}
          backgroundDarker="#018B87"
          raiseLevel={6}
          backgroundShadow="#C4C4C4"
          textColor="#FFFFFF"
          textSize={14}
          textFontFamily={fontFamily.interBold}
          // biome-ignore lint/suspicious/noConsole: temporary test scaffolding — issue #392 requires an identifiable console line on press
          onPress={() => console.log('[issue-392] AwesomeButton PRIMARY pressed')}
        >
          PRIMARY
        </AwesomeButton>
      </View>
      {/* ------------------------- END TEST SCAFFOLDING ----------------- */}
    </View>
  );
}
