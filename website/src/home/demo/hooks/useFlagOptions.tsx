import { useMemo } from 'react';
import { Text } from 'react-native';

import { styles } from '../demo.styles';
import type { FlagPlace } from '../demo.types';

/** Select options for places, each with its flag as the icon, under their group's header when `grouped`. */
export const useFlagOptions = (places: FlagPlace[], grouped = false) =>
  useMemo(
    () =>
      places.map((place) => ({
        label: place.label,
        value: place.label,
        group: grouped ? place.group : undefined,
        icon: <Text style={styles.flag}>{place.flag}</Text>,
      })),
    [places, grouped]
  );
