import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { lightTheme, PickersProvider } from '@elik56a/react-native-pickers';
import { JS_LOAD_LEVELS } from './benchmark.constants';
import { SCENARIOS, type ScenarioKey } from './scenarios';
import { useJsFps } from './useJsFps';
import { useJsLoad } from './useJsLoad';

const KEYS = Object.keys(SCENARIOS) as ScenarioKey[];

/**
 * One component at a time, ours or another library's, with a switchable JS load, for measuring frames while gestures run.
 * Both platforms read them from a screen recording. Starts on our wheel and our sheet.
 */
const BenchmarkApp = () => {
  const [load, setLoad] = useState<number>(0);
  const [scenario, setScenario] = useState<ScenarioKey>('wheel-ours');
  const [sheetScenario, setSheetScenario] = useState<ScenarioKey>('sheet-ours');
  const [open, setOpen] = useState(false);
  useJsLoad(load);
  const fps = useJsFps(`load=${load}`);
  const select = (key: ScenarioKey) => ('sheet' in SCENARIOS[key] ? setSheetScenario(key) : setScenario(key));
  const View_ = (SCENARIOS[scenario] as { view: () => React.ReactNode }).view;
  const Sheet = (SCENARIOS[sheetScenario] as { sheet: (p: { open: boolean; onClose: () => void }) => React.ReactNode }).sheet;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <PickersProvider design="material">
        <View style={styles.root}>
          <Text style={styles.status} testID="status">
            load {load}ms · JS {fps} fps · {scenario} · {sheetScenario}
          </Text>
          <View style={styles.row}>
            {JS_LOAD_LEVELS.map((level) => (
              <Pressable key={level} testID={`load-${level}`} onPress={() => setLoad(level)} style={styles.button}>
                <Text>{level}</Text>
              </Pressable>
            ))}
            <Pressable testID="open-sheet" onPress={() => setOpen((o) => !o)} style={styles.button}>
              <Text>sheet</Text>
            </Pressable>
          </View>
          <View style={styles.scenarios}>
            {KEYS.map((key) => (
              <Pressable key={key} testID={`scn-${key}`} onPress={() => select(key)} style={styles.chip}>
                <Text style={styles.chipText}>{key}</Text>
              </Pressable>
            ))}
          </View>
          <View testID="target" collapsable={false} style={styles.target}>
            <View_ key={scenario} />
          </View>
        </View>
        <Sheet key={sheetScenario} open={open} onClose={() => setOpen(false)} />
      </PickersProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 12, backgroundColor: lightTheme.colors.background },
  status: { fontSize: 16, padding: 16 },
  row: { flexDirection: 'row', gap: 8 },
  scenarios: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: lightTheme.colors.surface },
  chipText: { fontSize: 12 },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: lightTheme.colors.surface },
  target: { flex: 1 },
});

export default BenchmarkApp;
