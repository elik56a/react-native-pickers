import { Text, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import { styles } from '../showcase.styles';
import type { ChatMessage } from '../showcase.types';

export const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const { colors, radius } = usePickerTheme();
  const color = message.mine ? colors.onPrimary : colors.text;
  return (
    <View
      style={[
        styles.bubble,
        message.mine ? styles.mine : styles.theirs,
        { borderRadius: radius.lg, backgroundColor: message.mine ? colors.primary : colors.surface },
      ]}
    >
      <Text style={[styles.messageText, { color }]}>{message.text}</Text>
      <Text style={[styles.messageTime, { color: message.mine ? colors.onPrimary : colors.textSecondary }]}>{message.time}</Text>
    </View>
  );
};
