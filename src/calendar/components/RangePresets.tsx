import { HorizontalList } from '../../list/HorizontalList';
import { HORIZONTAL_LIST_VARIANT } from '../../list/list.constants';
import { RANGE_PRESETS_ACCESSIBILITY_LABEL } from '../calendar.constants';
import { styles } from '../calendar.styles';
import type { RangePresetsProps } from '../calendar.types';
import { getPresetItems, isSameRange } from '../calendar.utils';

/** Chips that pick a whole range in one tap; the one matching the range shows selected. */
export const RangePresets = ({ presets, range, rules, isDisabled, onSelect, theme, listProps }: RangePresetsProps) => (
  <HorizontalList
    variant={HORIZONTAL_LIST_VARIANT.chips}
    accessibilityLabel={RANGE_PRESETS_ACCESSIBILITY_LABEL}
    theme={theme}
    {...listProps}
    items={getPresetItems(presets, rules, isDisabled)}
    value={range}
    isEqual={isSameRange}
    onChange={onSelect}
    style={[styles.presets, listProps?.style]}
  />
);
