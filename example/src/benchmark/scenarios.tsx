import { useEffect, useRef } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import GorhomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import QuidoneWheel from '@quidone/react-native-wheel-picker';
import { Picker } from '@react-native-picker/picker';
import { CalendarList } from 'react-native-calendars';

import { BottomSheet, Calendar, EmojiPicker, WheelPicker } from '@elik56a/react-native-pickers';
import { SHEET_TITLE, WHEEL_ITEMS } from './benchmark.constants';

export interface SheetScenarioProps {
  open: boolean;
  onClose: () => void;
}

const noop = () => {};

const OursSheet = ({ open, onClose }: SheetScenarioProps) => (
  <BottomSheet visible={open} onClose={onClose} title={SHEET_TITLE} presentation="bottomSheet" height={0.5}>
    <Text style={styles.body}>Drag the handle</Text>
  </BottomSheet>
);

const GorhomScenario = ({ open, onClose }: SheetScenarioProps) => {
  const ref = useRef<GorhomSheet>(null);
  useEffect(() => {
    if (open) ref.current?.snapToIndex(0);
    else ref.current?.close();
  }, [open]);
  return (
    <GorhomSheet ref={ref} index={-1} snapPoints={['50%']} enablePanDownToClose onClose={onClose}>
      <BottomSheetView style={styles.sheetContent}>
        <Text style={styles.title}>{SHEET_TITLE}</Text>
        <Text style={styles.body}>Drag the handle</Text>
      </BottomSheetView>
    </GorhomSheet>
  );
};

/** The measured component's bounds, for the gesture scripts: `wheel` is kept for the first benchmark script. */
const Measured = ({ children, id = 'comp' }: { children: React.ReactNode; id?: string }) => (
  <View testID={id} collapsable={false}>
    {children}
  </View>
);

const OursWheel = () => (
  <Measured id="wheel">
    <WheelPicker items={WHEEL_ITEMS} value={100} onChange={noop} visibleItems={7} accessibilityLabel="Bench" />
  </Measured>
);

const QuidoneScenario = () => (
  <Measured>
    <QuidoneWheel data={WHEEL_ITEMS} value={100} visibleItemCount={7} onValueChanged={noop} />
  </Measured>
);

const NativePickerScenario = () => (
  <Measured>
    <Picker selectedValue={100} onValueChange={noop}>
      {WHEEL_ITEMS.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  </Measured>
);

const OursCalendar = () => (
  <Measured>
    <Calendar value={new Date()} onChange={noop} />
  </Measured>
);

const CalendarsScenario = () => {
  const { width } = useWindowDimensions();
  return (
    <Measured>
      <CalendarList horizontal pagingEnabled calendarWidth={width - 32} pastScrollRange={12} futureScrollRange={12} />
    </Measured>
  );
};

const OursEmoji = () => (
  <Measured>
    <EmojiPicker onSelect={noop} />
  </Measured>
);

/** Each library's take on a component, rendered in the same area. Sheets render at the root and open with the open button. */
export const SCENARIOS = {
  'sheet-ours': { sheet: OursSheet },
  'sheet-gorhom': { sheet: GorhomScenario },
  'wheel-ours': { view: OursWheel },
  'wheel-quidone': { view: QuidoneScenario },
  'wheel-native': { view: NativePickerScenario },
  'calendar-ours': { view: OursCalendar },
  'calendar-rnc': { view: CalendarsScenario },
  'emoji-ours': { view: OursEmoji },
} satisfies Record<string, { sheet?: (props: SheetScenarioProps) => React.ReactNode; view?: () => React.ReactNode }>;

export type ScenarioKey = keyof typeof SCENARIOS;

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', padding: 16 },
  body: { fontSize: 16, padding: 16 },
  sheetContent: { flex: 1 },
});
