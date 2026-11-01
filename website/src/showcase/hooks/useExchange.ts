import { useState } from 'react';

import type { CurrencyCode } from '@elik56a/react-native-pickers';
import { EXCHANGE, EXCHANGE_SIDE } from '../showcase.constants';
import type { TypedAmount } from '../showcase.types';
import { formatRate, getExchangeAmounts } from '../showcase.utils';

/** A transfer abroad: the side the user types stays as typed, and the other follows it through either currency change. */
export const useExchange = () => {
  const [from, setFrom] = useState<CurrencyCode>(EXCHANGE.from);
  const [to, setTo] = useState<CurrencyCode>(EXCHANGE.to);
  const [typed, setTyped] = useState<TypedAmount>({
    side: EXCHANGE_SIDE.send,
    amount: EXCHANGE.amount,
  });

  return {
    from,
    setFrom,
    to,
    setTo,
    ...getExchangeAmounts(typed, from, to),
    rate: formatRate(from, to),
    changeSend: (amount: number | null) => setTyped({ side: EXCHANGE_SIDE.send, amount }),
    changeReceive: (amount: number | null) => setTyped({ side: EXCHANGE_SIDE.receive, amount }),
  };
};
