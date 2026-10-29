import { CountryPicker, DatePickerField, HorizontalList, PhoneField } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { daysFromNow, deviceSheetProps } from '../../home/demo/demo.utils';
import { useDelivery } from '../hooks/useDelivery';
import { DELIVERY_WINDOWS } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';

export const DeliveryScreen = ({ platform, screenHeight }: ScreenProps) => {
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const delivery = useDelivery();
  return (
    <AppScreen
      platform={platform}
      title="Delivery details"
      subtitle="Step 2 of 3 · checkout"
      action={
        <ActionButton
          label={delivery.ready ? 'Continue to payment' : 'Add a phone number'}
          busyLabel="Checking…"
          doneLabel="✓ Saved"
          disabled={!delivery.ready}
        />
      }
    >
      <CountryPicker label="Ship to" value={delivery.shipTo} onChange={delivery.changeShipTo} sheet={{ sheetProps }} />
      <PhoneField
        label="Phone for the courier"
        value={delivery.phone}
        onChange={delivery.changePhone}
        country={delivery.phoneCountry}
        onCountryChange={delivery.setPhoneCountry}
        sheet={{ sheetProps }}
      />
      <DatePickerField
        label="Delivery day"
        value={delivery.day}
        onConfirm={delivery.setDay}
        minDate={daysFromNow(1)}
        sheetProps={sheetProps}
      />
      <HorizontalList items={DELIVERY_WINDOWS} value={delivery.timeWindow} onChange={delivery.setTimeWindow} />
    </AppScreen>
  );
};
