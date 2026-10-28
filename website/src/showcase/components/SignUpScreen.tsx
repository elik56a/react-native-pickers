import { useState } from 'react';

import { DatePickerField, HorizontalList, SelectPicker } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { deviceSheetProps } from '../../home/demo/demo.utils';
import { useFlagOptions } from '../../home/demo/hooks/useFlagOptions';
import { COUNTRIES, INTERESTS, LANGUAGES, SIGN_UP } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const SignUpScreen = ({ platform, screenHeight }: ScreenProps) => {
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const countries = useFlagOptions(COUNTRIES);
  const [birthday, setBirthday] = useState<Date | null>(SIGN_UP.birthday);
  const [country, setCountry] = useState<string | null>(SIGN_UP.country);
  const [interests, setInterests] = useState(SIGN_UP.interests);
  const [language, setLanguage] = useState(SIGN_UP.language);
  return (
    <AppScreen
      platform={platform}
      title="Create account"
      subtitle="Step 2 of 3 · about you"
      action={<ActionButton label="Continue" busyLabel="Saving…" doneLabel="✓ Saved" />}
    >
      <DatePickerField
        label="Birthday"
        display="wheel"
        value={birthday}
        onConfirm={setBirthday}
        minDate={SIGN_UP.oldestBirthday}
        maxDate={new Date()}
        sheetProps={sheetProps}
      />
      <SelectPicker label="Country" options={countries} value={country} onChange={setCountry} searchable sheet={{ sheetProps }} />
      <SelectPicker
        label="Interests"
        options={INTERESTS}
        multiple
        value={interests}
        onChange={setInterests}
        maxSelected={SIGN_UP.maxInterests}
        sheet={{ sheetProps }}
      />
      <HorizontalList items={LANGUAGES} value={language} onChange={setLanguage} />
    </AppScreen>
  );
};
