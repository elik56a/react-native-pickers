import { useState } from 'react';

import type { DesignPreference } from '@elik56a/react-native-pickers';
import { DESIGN, PickersProvider } from '@elik56a/react-native-pickers';
import { Layout } from './components/Layout';
import type { Insets } from './example.types';

const NO_INSETS: Insets = { top: 0, bottom: 0 };

/** Every component with the docs' prop playgrounds, and the docs' showcase screens, in one app. */
const App = ({ insets = NO_INSETS }: { insets?: Insets }) => {
  const [design, setDesign] = useState<DesignPreference>(DESIGN.auto);
  return (
    <PickersProvider design={design}>
      <Layout insets={insets} design={design} onDesignChange={setDesign} />
    </PickersProvider>
  );
};

export default App;
