import { Text, TextInput, View } from 'react-native';

import { textStyle } from '../../core';
import { Touchable } from '../../core/components/Touchable';
import { coreStyles } from '../../core/core.styles';
import { HEX_MAX_LENGTH, SWATCH_CHECK } from '../color.constants';
import { styles } from '../color.styles';
import type { HexInputProps } from '../color.types';
import { useCopy } from '../hooks/useCopy';
import { useHexInput } from '../hooks/useHexInput';
import { CopyIcon } from './ColorIcons';

/** The hex code to read, type or copy, with the copy button in its end corner. */
export const HexInput = ({
  value,
  rgb,
  label,
  onChange,
  copy,
  copyLabel,
  copiedLabel,
  showPreview = false,
  theme,
  slots,
  testID,
}: HexInputProps) => {
  const input = useHexInput(value, onChange);
  const clipboard = useCopy(copy);
  const c = theme.colors;
  return (
    <View style={[styles.hexRow, { gap: theme.spacing.sm }]}>
      {showPreview ? (
        <View style={[styles.preview, { backgroundColor: rgb, borderRadius: theme.radius.sm, borderColor: c.border }, slots?.preview]} />
      ) : null}
      <View style={styles.hexField}>
        <TextInput
          value={input.text}
          onChangeText={input.onChangeText}
          onBlur={input.onBlur}
          maxLength={HEX_MAX_LENGTH}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel={label}
          style={[
            textStyle(theme, 'md'),
            styles.hexInput,
            coreStyles.noOutline,
            {
              borderRadius: theme.radius.sm,
              borderColor: c.border,
              paddingStart: theme.spacing.md,
              paddingEnd: clipboard.copy ? 40 : theme.spacing.md,
              backgroundColor: c.background,
            },
            slots?.hexInput,
          ]}
          testID={testID}
        />
        {clipboard.copy ? (
          <Touchable
            theme={theme}
            onPress={() => clipboard.copy?.(value)}
            accessibilityRole="button"
            accessibilityLabel={clipboard.copied ? copiedLabel : copyLabel}
            style={[styles.hexButton, { borderRadius: theme.radius.sm }]}
            testID={testID ? `${testID}-copy` : undefined}
          >
            {clipboard.copied ? (
              <Text style={[textStyle(theme, 'md', 'bold'), { color: c.primary }]}>{SWATCH_CHECK}</Text>
            ) : (
              <CopyIcon color={c.textSecondary} />
            )}
          </Touchable>
        ) : null}
      </View>
    </View>
  );
};
