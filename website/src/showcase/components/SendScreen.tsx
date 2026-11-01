import { useState } from 'react';
import { View } from 'react-native';

import type { CurrencyCode } from '@elik56a/react-native-pickers';
import { AmountField, HorizontalList } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { deviceSheetProps } from '../../home/demo/demo.utils';
import { SEND } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { ScreenProps } from '../showcase.types';
import { formatMoney, quickAmountItems } from '../showcase.utils';

export const SendScreen = ({ platform, screenHeight }: ScreenProps) => {
  const [amount, setAmount] = useState<number | null>(SEND.amount);
  const [currency, setCurrency] = useState<CurrencyCode>(SEND.currency);
  return (
    <AppScreen
      platform={platform}
      title="Send to Maya"
      subtitle="🧑‍🍳 @maya · Lisbon"
      action={
        <ActionButton
          label={amount ? `Send ${formatMoney(amount, currency)}` : 'Enter an amount'}
          busyLabel="Sending…"
          doneLabel="✓ Sent"
          disabled={!amount}
        />
      }
    >
      <View style={styles.sendAmount}>
        <AmountField
          variant="large"
          showCurrencyPicker
          preferred={SEND.preferred}
          currency={currency}
          onCurrencyChange={setCurrency}
          value={amount}
          onChange={setAmount}
          helperText="Arrives in seconds"
          sheet={{ sheetProps: deviceSheetProps(platform, screenHeight) }}
        />
      </View>
      <HorizontalList variant="chips" items={quickAmountItems(currency)} value={amount} onChange={setAmount} />
    </AppScreen>
  );
};
