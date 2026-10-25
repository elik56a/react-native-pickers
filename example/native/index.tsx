import React from 'react';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import App from '../App';

function Root() {
  const insets = useSafeAreaInsets();
  return <App insets={insets} />;
}

registerRootComponent(() => (
  <SafeAreaProvider>
    <Root />
  </SafeAreaProvider>
));
