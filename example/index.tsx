import { registerRootComponent } from 'expo';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import App from './src/App';
import BenchmarkApp from './src/benchmark/BenchmarkApp';

function Root() {
  const insets = useSafeAreaInsets();
  return <App insets={insets} />;
}

// EXPO_PUBLIC_BENCHMARK=1 starts the frame benchmark (see src/benchmark) instead of the example app.
registerRootComponent(() =>
  process.env.EXPO_PUBLIC_BENCHMARK === '1' ? (
    <BenchmarkApp />
  ) : (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  )
);
