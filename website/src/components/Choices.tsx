import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

import { HorizontalList, type HorizontalListIconPosition, type HorizontalListItem, PickersProvider } from '@elik56a/react-native-pickers';
import styles from './Choices.module.css';

interface ChoicesProps {
  /** Names the choices for screen readers. */
  label: string;
  labels: readonly string[];
  /** Index of the chosen label, -1 for none. */
  selected: number;
  onChoose: (index: number) => void;
  /** An icon per label */
  icons?: readonly HorizontalListItem<number>['icon'][];
  iconPosition?: HorizontalListIconPosition;
}

/** One-of choices as the library's own HorizontalList, which scrolls when they don't fit. Browser only, like the previews. */
export const Choices = ({ label, labels, selected, onChoose, icons, iconPosition }: ChoicesProps) => {
  const { colorMode } = useColorMode();
  return (
    <BrowserOnly fallback={<div className={styles.fallback} />}>
      {() => (
        <PickersProvider colorScheme={colorMode}>
          <HorizontalList
            accessibilityLabel={label}
            items={labels.map((text, i) => ({
              label: text,
              value: i,
              icon: icons?.[i],
            }))}
            iconPosition={iconPosition}
            value={selected}
            onChange={onChoose}
          />
        </PickersProvider>
      )}
    </BrowserOnly>
  );
};
