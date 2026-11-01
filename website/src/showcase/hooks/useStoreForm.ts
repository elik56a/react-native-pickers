import { useState } from 'react';

import type { CountryCode } from '@elik56a/react-native-pickers';
import { daysFromNowAt, labelOptions } from '../../home/demo/demo.utils';
import { STORE, STORE_CITIES, STORE_STATES, STORE_TAGS } from '../showcase.constants';
import type { StoreValues } from '../showcase.types';

const initialValues = (): StoreValues => ({
  country: STORE.country,
  state: null,
  city: null,
  hours: {
    start: daysFromNowAt(0, STORE.opens),
    end: daysFromNowAt(0, STORE.closes),
  },
  sale: undefined,
  tags: STORE.tags,
});

/** A store's details: picking a country or a state clears the choices below it, and new tags join the options. */
export const useStoreForm = () => {
  const [values, setValues] = useState(initialValues);
  const [tags, setTags] = useState(STORE_TAGS);
  const update = (changes: Partial<StoreValues>) =>
    setValues((current) => ({
      ...current,
      ...changes,
    }));

  return {
    values,
    stateOptions: labelOptions((values.country ? STORE_STATES[values.country] : undefined) ?? []),
    cityOptions: labelOptions((values.state ? STORE_CITIES[values.state] : undefined) ?? []),
    tagOptions: labelOptions(tags),
    setCountry: (country: CountryCode | null) => update({ country, state: null, city: null }),
    setState: (state: string | null) => update({ state, city: null }),
    setCity: (city: string | null) => update({ city }),
    setHours: (hours: StoreValues['hours']) => update({ hours }),
    setSale: (sale: StoreValues['sale']) => update({ sale }),
    setTags: (picked: string[]) => update({ tags: picked }),
    createTag: (text: string) => {
      setTags((current) => [...current, text]);
      return {
        label: text,
        value: text,
      };
    },
  };
};
