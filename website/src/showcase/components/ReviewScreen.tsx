import { useState } from 'react';
import { Text, View } from 'react-native';

import { Rating, usePickerTheme } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { REVIEW, REVIEW_CATEGORIES } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { ScreenProps } from '../showcase.types';

export const ReviewScreen = ({ platform }: ScreenProps) => {
  const { colors } = usePickerTheme();
  const [overall, setOverall] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  return (
    <AppScreen
      platform={platform}
      title="Rate your stay"
      subtitle={`${REVIEW.place} · ${REVIEW.city}`}
      action={
        <ActionButton label={overall ? 'Post review' : 'Tap the stars'} busyLabel="Posting…" doneLabel="✓ Thanks!" disabled={!overall} />
      }
    >
      <View style={[styles.preview, { backgroundColor: colors.surface }]}>
        <Text style={[styles.previewTitle, { color: colors.text }]}>{REVIEW.place}</Text>
        <View style={styles.scoreRow}>
          <Rating value={REVIEW.average} readOnly size={16} accessibilityLabel="Average rating" />
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {REVIEW.average} · {REVIEW.reviews} reviews
          </Text>
        </View>
      </View>
      <View style={styles.setting}>
        <View style={styles.settingHeader}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Your rating</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{overall ? `${overall} of 5` : '–'}</Text>
        </View>
        <Rating step={0.5} size={40} value={overall} onChange={setOverall} accessibilityLabel="Your rating" />
      </View>
      {REVIEW_CATEGORIES.map((category) => (
        <View key={category} style={styles.categoryRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>{category}</Text>
          <Rating
            size={22}
            value={scores[category] ?? 0}
            onChange={(value) =>
              setScores((prev) => ({
                ...prev,
                [category]: value,
              }))
            }
            accessibilityLabel={category}
          />
        </View>
      ))}
    </AppScreen>
  );
};
