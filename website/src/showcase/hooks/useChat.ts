import type { ComponentRef } from 'react';
import { useRef, useState } from 'react';
import type { ScrollView, TextInputSelectionChangeEvent } from 'react-native';

import type { SkinTone } from '@elik56a/react-native-pickers';
import { CHAT, CHAT_RECENT } from '../showcase.constants';
import type { TextSelection } from '../showcase.types';
import { insertAtSelection } from '../showcase.utils';

const CARET_AT_START: TextSelection = { start: 0, end: 0 };

/** The chat's messages and composer: emojis from the sheet land at the cursor, and Send posts the text as a new message. */
export const useChat = () => {
  const [messages, setMessages] = useState(CHAT);
  const [text, setText] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [skinTone, setSkinTone] = useState<SkinTone>(0);
  const [recent, setRecent] = useState(CHAT_RECENT);
  const selection = useRef(CARET_AT_START);
  const list = useRef<ComponentRef<typeof ScrollView>>(null);
  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setMessages((m) => [...m, { id: Date.now(), text: text.trim(), mine: true, time }]);
    setText('');
    selection.current = CARET_AT_START;
  };

  const insertEmoji = (emoji: string) => {
    const next = insertAtSelection(text, selection.current, emoji);
    setText(next.text);
    selection.current = next.selection;
  };

  return {
    messages,
    list,
    scrollToEnd: () => list.current?.scrollToEnd(),
    text,
    setText,
    onSelectionChange: (e: TextInputSelectionChangeEvent) => {
      selection.current = e.nativeEvent.selection;
    },
    canSend,
    send,
    emojiOpen,
    openEmoji: () => setEmojiOpen(true),
    closeEmoji: () => setEmojiOpen(false),
    insertEmoji,
    skinTone,
    setSkinTone,
    recent,
    setRecent,
  };
};

export type Chat = ReturnType<typeof useChat>;
