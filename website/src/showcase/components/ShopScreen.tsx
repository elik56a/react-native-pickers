import { useState } from 'react';
import { View } from 'react-native';

import { DatePickerField, HorizontalList, SelectPicker, WheelPickerField } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { styles } from '../../home/demo/demo.styles';
import { daysFromNow, deviceSheetProps } from '../../home/demo/demo.utils';
import { BRANDS, SHOP, SHOP_CATEGORIES, SIZES } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const ShopScreen = ({ platform, screenHeight }: ScreenProps) => {
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const [category, setCategory] = useState(SHOP.category);
  const [size, setSize] = useState(SHOP.size);
  const [brands, setBrands] = useState(SHOP.brands);
  const [deliverBy, setDeliverBy] = useState<Date | null>(() => daysFromNow(SHOP.deliverIn));
  return (
    <AppScreen
      platform={platform}
      title="Filters"
      subtitle={`${category} · size ${size}`}
      action={<ActionButton label={`Show ${SHOP.results} results`} busyLabel="Filtering…" doneLabel={`✓ ${SHOP.results} results`} />}
    >
      <HorizontalList variant="chips" items={SHOP_CATEGORIES} value={category} onChange={setCategory} />
      <View style={styles.pair}>
        <View style={styles.half}>
          <WheelPickerField label="Size" items={SIZES} value={size} onConfirm={setSize} sheetProps={sheetProps} />
        </View>
        <View style={styles.half}>
          <DatePickerField label="Deliver by" value={deliverBy} onConfirm={setDeliverBy} minDate={daysFromNow(1)} sheetProps={sheetProps} />
        </View>
      </View>
      <SelectPicker label="Brands" options={BRANDS} multiple value={brands} onChange={setBrands} sheet={{ sheetProps }} />
    </AppScreen>
  );
};
