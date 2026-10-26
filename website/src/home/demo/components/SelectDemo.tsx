import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import type { DateRange } from '@elik56a/react-native-pickers';
import { DatePickerField, SelectPicker } from '@elik56a/react-native-pickers';
import { PLATFORM } from '../../device/device.constants';
import type { Platform } from '../../device/device.types';
import type { TabOptions } from '../../playground/playground.types';
import { CABINS, CITIES, DEFAULT_CITIES, MAX_CITIES, PHONE_STATUS_BAR, SELECT_LIST_HEIGHT } from '../demo.constants';
import { styles } from '../demo.styles';
import { startOfToday, stay } from '../demo.utils';

interface SelectDemoProps {
  options: TabOptions<'select'>;
  platform: Platform;
  screenHeight?: number;
}

export const SelectDemo = ({ options, platform, screenHeight }: SelectDemoProps) => {
  const [cities, setCities] = useState<string[]>(DEFAULT_CITIES);
  const [city, setCity] = useState<string | null>(DEFAULT_CITIES[0]);
  const [cabin, setCabin] = useState<string | null>(CABINS[0].value);
  const [range, setRange] = useState<DateRange>(() => stay(1, 4));
  const cityOptions = useMemo(
    () =>
      CITIES.map((c) => ({
        label: c.label,
        value: c.label,
        icon: <Text style={styles.flag}>{c.flag}</Text>,
        group: options.groups ? c.group : undefined,
      })),
    [options.groups]
  );
  const isWeb = platform === PLATFORM.web;
  const presentation = isWeb ? 'dropdown' : 'bottomSheet';
  const sheet = {
    sheetProps: {
      bottomInset: platform === PLATFORM.ios ? 30 : 16,
      draggable: true,
      expandedHeight: screenHeight ? screenHeight - PHONE_STATUS_BAR : undefined,
    },
  };
  const shared = {
    label: 'Cities',
    options: cityOptions,
    searchable: options.searchable,
    listHeight: SELECT_LIST_HEIGHT,
    presentation,
    sheet,
  } as const;
  return (
    <View style={styles.form}>
      {options.multiple ? (
        <SelectPicker {...shared} multiple value={cities} onChange={setCities} maxSelected={MAX_CITIES} />
      ) : (
        <SelectPicker {...shared} value={city} onChange={setCity} />
      )}
      <SelectPicker label="Cabin" options={CABINS} value={cabin} onChange={setCabin} presentation={presentation} sheet={sheet} />
      <DatePickerField
        label="Dates"
        mode="range"
        value={range}
        onConfirm={setRange}
        minDate={startOfToday()}
        presentation={isWeb ? 'modal' : 'bottomSheet'}
        {...sheet}
      />
    </View>
  );
};
