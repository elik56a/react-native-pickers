import { useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { EmojiPicker, usePickerTheme } from '@elik56a/react-native-pickers';
import { DEMO_TAB } from '../../playground/playground.constants';
import { DEFAULT_EMOJI, TITLES } from '../demo.constants';
import { styles } from '../demo.styles';
import type { DemoScreenProps } from '../demo.types';
import { demoSubtitle } from '../demo.utils';
import { useTabFade } from '../hooks/useTabFade';
import { DateDemo } from './DateDemo';
import { DemoTabBar } from './DemoTabBar';
import { SelectDemo } from './SelectDemo';
import { TimeDemo } from './TimeDemo';
import { WheelDemo } from './WheelDemo';

const EMOJI_HEIGHT = 300;

export const DemoScreen = ({ platform, screenHeight, demo }: DemoScreenProps) => {
  const { colors } = usePickerTheme();
  const { tab, options, selectTab, stopAutoplay } = demo;
  const fade = useTabFade(tab);
  const [emoji, setEmoji] = useState(DEFAULT_EMOJI);
  return (
    <View
      style={[styles.root, { backgroundColor: colors.background }]}
      onStartShouldSetResponderCapture={() => {
        stopAutoplay();
        return false;
      }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {TITLES[tab]}
          {tab === DEMO_TAB.emoji ? ` ${emoji}` : ''}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{demoSubtitle(tab, options)}</Text>
      </View>
      <Animated.View style={[styles.body, fade]}>
        {tab === DEMO_TAB.date && <DateDemo options={options.date} />}
        {tab === DEMO_TAB.time && <TimeDemo options={options.time} />}
        {tab === DEMO_TAB.wheel && <WheelDemo options={options.wheel} />}
        {tab === DEMO_TAB.select && <SelectDemo options={options.select} platform={platform} screenHeight={screenHeight} />}
        {tab === DEMO_TAB.emoji && (
          <EmojiPicker
            height={EMOJI_HEIGHT}
            columns={options.emoji.columns}
            showSkinTones={options.emoji.showSkinTones}
            categoryBarPosition={options.emoji.categoryBarPosition}
            onSelect={setEmoji}
          />
        )}
      </Animated.View>
      <DemoTabBar tab={tab} onSelect={selectTab} />
    </View>
  );
};
