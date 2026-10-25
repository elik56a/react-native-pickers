import React from 'react';
import Provider from '@theme-original/Playground/Provider';
import { useColorMode } from '@docusaurus/theme-common';
import { PickersProvider } from '@elik56a/react-native-pickers';
import { toRunnable } from '../../../live/toRunnable';

type Props = React.ComponentProps<typeof Provider>;

// Examples are real files (imports + `export default function`), so readers can copy them verbatim.
export default function ProviderWrapper(props: Props) {
  const { colorMode } = useColorMode();
  return (
    <PickersProvider colorScheme={colorMode}>
      <Provider {...props} noInline transformCode={toRunnable} />
    </PickersProvider>
  );
}
