import type { ComponentType } from 'react';
import { Text } from 'react-native';

import {
  AmountField,
  ColorPicker,
  DatePicker,
  DurationPicker,
  EmojiPicker,
  getCountryFlag,
  getLanguage,
  type LanguageCode,
  MonthPicker,
  SelectList,
  type SelectOption,
  TimePicker,
  TimeRangePicker,
} from '@elik56a/react-native-pickers';
import { HERO_EMOJI_CHROME, HERO_LANGUAGES, HERO_MIN_EMOJI_HEIGHT } from '../hero.constants';
import { styles } from '../hero.styles';
import type { HeroPickerProps, HeroWord } from '../hero.types';
import { fillHeight } from '../hero.utils';

/** Each language in itself, under its English name, with the flag of where it's most spoken. */
const LANGUAGE_OPTIONS: SelectOption<LanguageCode>[] = HERO_LANGUAGES.flatMap((code) => {
  const language = getLanguage(code);
  return language
    ? [
        {
          value: language.code,
          label: language.nativeName,
          description: language.name,
          icon: <Text style={styles.flag}>{getCountryFlag(language.country)}</Text>,
        },
      ]
    : [];
});

/** Each word's picker, on the value the three devices share. */
export const HERO_PICKERS: Record<HeroWord, ComponentType<HeroPickerProps>> = {
  time: ({ values, set }) => <TimePicker value={values.time} onChange={set('time')} />,
  range: ({ values, set }) => <TimeRangePicker value={values.range} onChange={set('range')} />,
  date: ({ values, set }) => <DatePicker mode="range" value={values.date} onChange={set('date')} />,
  month: ({ values, set }) => <MonthPicker value={values.month} onChange={set('month')} />,
  duration: ({ values, set }) => <DurationPicker value={values.duration} onChange={set('duration')} />,
  color: ({ values, set }) => <ColorPicker value={values.color} onChange={set('color')} />,
  currency: ({ values, set }) => (
    <AmountField
      variant="large"
      showCurrencyPicker
      value={values.amount}
      onChange={set('amount')}
      currency={values.currency}
      onCurrencyChange={set('currency')}
      helperText="Arrives in seconds"
    />
  ),
  language: ({ values, set }) => <SelectList options={LANGUAGE_OPTIONS} value={values.language} onChange={set('language')} />,
  emoji: ({ set, screenHeight }) => (
    <EmojiPicker onSelect={set('emoji')} height={fillHeight(screenHeight, HERO_EMOJI_CHROME, HERO_MIN_EMOJI_HEIGHT)} />
  ),
};
