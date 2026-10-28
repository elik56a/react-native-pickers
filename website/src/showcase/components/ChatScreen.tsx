import { ScrollView, Text, View } from 'react-native';

import { EmojiPickerSheet, usePickerTheme } from '@elik56a/react-native-pickers';
import { deviceSheetProps } from '../../home/demo/demo.utils';
import { PLATFORM } from '../../home/device/device.constants';
import { useChat } from '../hooks/useChat';
import { CHAT_CONTACT } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { ScreenProps } from '../showcase.types';
import { ChatBubble } from './ChatBubble';
import { ChatComposer } from './ChatComposer';

/** The chat-emoji recipe: an emoji button beside Send opens the emojis in a sheet, and they land at the cursor. */
export const ChatScreen = ({ platform, screenHeight }: ScreenProps) => {
  const { colors } = usePickerTheme();
  const chat = useChat();
  return (
    <View style={[styles.chat, platform === PLATFORM.web && styles.browserChat, { backgroundColor: colors.background }]}>
      <View style={[styles.chatHeader, { borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
          <Text style={styles.avatarText}>{CHAT_CONTACT.avatar}</Text>
        </View>
        <View>
          <Text style={[styles.name, { color: colors.text }]}>{CHAT_CONTACT.name}</Text>
          <Text style={[styles.status, { color: colors.textSecondary }]}>{CHAT_CONTACT.status}</Text>
        </View>
      </View>
      <ScrollView
        ref={chat.list}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={chat.scrollToEnd}
      >
        {chat.messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </ScrollView>
      <ChatComposer chat={chat} />
      <EmojiPickerSheet
        visible={chat.emojiOpen}
        onClose={chat.closeEmoji}
        onSelect={chat.insertEmoji}
        skinTone={chat.skinTone}
        onSkinToneChange={chat.setSkinTone}
        recent={chat.recent}
        onRecentChange={chat.setRecent}
        sheetProps={deviceSheetProps(platform, screenHeight)}
      />
    </View>
  );
};
