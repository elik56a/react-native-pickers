import { useState } from 'react';

import type { CountryCode, PhoneDetails } from '@elik56a/react-native-pickers';
import { daysFromNow } from '../../home/demo/demo.utils';
import { DELIVERY } from '../showcase.constants';

/** A checkout's delivery step: the phone takes the shipping country's code until the user types a number. */
export const useDelivery = () => {
  const [shipTo, setShipTo] = useState<CountryCode | null>(DELIVERY.country);
  const [phone, setPhone] = useState(DELIVERY.phone);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(DELIVERY.country);
  const [phoneValid, setPhoneValid] = useState(true);
  const [day, setDay] = useState<Date | null>(() => daysFromNow(DELIVERY.day));
  const [timeWindow, setTimeWindow] = useState(DELIVERY.window);

  const changeShipTo = (code: CountryCode | null) => {
    setShipTo(code);
    if (code && !phone) setPhoneCountry(code);
  };

  const changePhone = (value: string, details: PhoneDetails) => {
    setPhone(value);
    setPhoneValid(details.valid);
  };

  return {
    shipTo,
    changeShipTo,
    phone,
    changePhone,
    phoneCountry,
    setPhoneCountry,
    ready: !!shipTo && phoneValid && !!day,
    day,
    setDay,
    timeWindow,
    setTimeWindow,
  };
};
