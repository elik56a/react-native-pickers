import { PickersProvider } from '@elik56a/react-native-pickers';
import { AppScreen } from '../demo/components/AppScreen';
import { HERO_PICKERS } from './components/HeroPicker';
import type { HeroAppProps } from './hero.types';

/** One device's app: the word's screen in that device's own design. */
export const HeroApp = ({ spec, platform, colorMode, ...picker }: HeroAppProps) => {
  const Picker = HERO_PICKERS[spec.word];
  return (
    <PickersProvider colorScheme={colorMode} platform={platform}>
      <AppScreen platform={platform} title={spec.title} subtitle={spec.subtitle} scroll>
        <Picker {...picker} />
      </AppScreen>
    </PickersProvider>
  );
};
