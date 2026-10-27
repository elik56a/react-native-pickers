import { HorizontalList } from '@elik56a/react-native-pickers';
import type { DemoTab } from '../../playground/playground.types';
import { DEMO_TAB_ITEMS } from '../demo.constants';
import { styles } from '../demo.styles';

export const DemoTabBar = ({ tab, onSelect }: { tab: DemoTab; onSelect: (tab: DemoTab) => void }) => (
  <HorizontalList accessibilityLabel="Pickers" items={DEMO_TAB_ITEMS} value={tab} onChange={onSelect} style={styles.tabBar} />
);
