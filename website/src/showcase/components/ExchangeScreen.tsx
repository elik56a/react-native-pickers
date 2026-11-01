import { Text } from 'react-native';

import { AmountField, usePickerTheme } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { deviceSheetProps } from '../../home/demo/demo.utils';
import { useExchange } from '../hooks/useExchange';
import { EXCHANGE_CURRENCIES } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { ScreenProps } from '../showcase.types';

export const ExchangeScreen = ({ platform, screenHeight }: ScreenProps) => {
  const { colors } = usePickerTheme();
  const sheet = { sheetProps: deviceSheetProps(platform, screenHeight) };
  const exchange = useExchange();
  return (
    <AppScreen
      platform={platform}
      title="Send abroad"
      subtitle={`${exchange.rate} · demo rates`}
      action={<ActionButton label="Continue" busyLabel="Locking the rate…" doneLabel="✓ Rate locked" disabled={!exchange.send} />}
    >
      <AmountField
        label="You send"
        showCurrencyPicker
        currencies={EXCHANGE_CURRENCIES}
        currency={exchange.from}
        onCurrencyChange={exchange.setFrom}
        value={exchange.send}
        onChange={exchange.changeSend}
        sheet={sheet}
      />
      <AmountField
        label="Maya gets"
        showCurrencyPicker
        currencies={EXCHANGE_CURRENCIES}
        currency={exchange.to}
        onCurrencyChange={exchange.setTo}
        value={exchange.receive}
        onChange={exchange.changeReceive}
        sheet={sheet}
      />
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Type on either side. Try JPY or KWD: the yen has no decimals and the dinar has three.
      </Text>
    </AppScreen>
  );
};
