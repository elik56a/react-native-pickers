import { Pressable, Text, TextInput, View } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';
import type { Chat } from '../hooks/useChat';
import { styles } from '../showcase.styles';

/** The message box, with the emoji button beside Send as in the chat-emoji recipe. */
export const ChatComposer = ({ chat }: { chat: Chat }) => {
  const { colors } = usePickerTheme();
  return (
    <View style={[styles.composer, { borderColor: colors.border }]}>
      <TextInput
        value={chat.text}
        onChangeText={chat.setText}
        onSelectionChange={chat.onSelectionChange}
        onSubmitEditing={chat.send}
        placeholder="Message"
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
      />
      <Pressable onPress={chat.openEmoji} accessibilityRole="button" accessibilityLabel="Emoji" style={styles.iconButton}>
        <Text style={styles.iconText}>😊</Text>
      </Pressable>
      <Pressable
        onPress={chat.send}
        disabled={!chat.canSend}
        accessibilityRole="button"
        accessibilityLabel="Send"
        style={[styles.send, { backgroundColor: chat.canSend ? colors.primary : colors.surface }]}
      >
        <Text style={[styles.sendText, { color: chat.canSend ? colors.onPrimary : colors.textDisabled }]}>↑</Text>
      </Pressable>
    </View>
  );
};
