import { CountryPicker, DatePickerField, formatTimeRange, SelectPicker, TimeRangePickerField } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { deviceSheetProps, startOfToday } from '../../home/demo/demo.utils';
import { useStoreForm } from '../hooks/useStoreForm';
import { STORE, STORE_COUNTRIES } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';
import { launchPresets } from '../showcase.utils';

export const StoreScreen = ({ platform, screenHeight }: ScreenProps) => {
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const store = useStoreForm();
  const { values } = store;
  return (
    <AppScreen
      platform={platform}
      title="New store"
      subtitle={`Open ${formatTimeRange(values.hours)}`}
      scroll
      action={<ActionButton label="Open store" busyLabel="Opening…" doneLabel="✓ Open" />}
    >
      <CountryPicker
        label="Country"
        countries={STORE_COUNTRIES}
        value={values.country}
        onChange={store.setCountry}
        sheet={{ sheetProps }}
      />
      <SelectPicker
        label="State"
        placeholder={values.country ? 'Choose a state' : 'Choose a country first'}
        disabled={!values.country}
        options={store.stateOptions}
        value={values.state}
        onChange={store.setState}
        sheet={{ sheetProps }}
      />
      <SelectPicker
        label="City"
        placeholder={values.state ? 'Choose a city' : 'Choose a state first'}
        disabled={!values.state}
        options={store.cityOptions}
        value={values.city}
        onChange={store.setCity}
        sheet={{ sheetProps }}
      />
      <TimeRangePickerField
        label="Opening hours"
        startLabel="Opens"
        endLabel="Closes"
        minuteInterval={STORE.minuteInterval}
        minDuration={STORE.minDuration}
        value={values.hours}
        onConfirm={store.setHours}
        sheetProps={sheetProps}
      />
      <DatePickerField
        label="Launch sale"
        placeholder="Pick the days"
        mode="range"
        minDate={startOfToday()}
        presets={launchPresets()}
        value={values.sale}
        onConfirm={store.setSale}
        sheetProps={sheetProps}
      />
      <SelectPicker
        label="Tags"
        multiple
        searchable
        helperText="Search for a tag, or type a new one"
        options={store.tagOptions}
        value={values.tags}
        onChange={store.setTags}
        onCreate={store.createTag}
        sheet={{ sheetProps }}
      />
    </AppScreen>
  );
};
