import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { EmojiPicker, SelectPicker, SelectList, PickersProvider } from '../src';

const countries = [
  { label: 'Israel', value: 'IL', icon: <Text>🇮🇱</Text>, group: 'Middle East', keywords: ['ישראל'] },
  { label: 'Jordan', value: 'JO', icon: <Text>🇯🇴</Text>, group: 'Middle East' },
  { label: 'France', value: 'FR', icon: <Text>🇫🇷</Text>, group: 'Europe', description: 'République française' },
  { label: 'Germany', value: 'DE', icon: <Text>🇩🇪</Text>, group: 'Europe' },
  { label: 'Spain', value: 'ES', icon: <Text>🇪🇸</Text>, group: 'Europe', disabled: true },
];

export default function Demo() {
  const [country, setCountry] = useState<string | null>('IL');
  const [tags, setTags] = useState<string[]>(['react', 'ts']);
  const [picked, setPicked] = useState('');
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <SelectPicker label="Country" options={countries} value={country} onChange={(v) => setCountry(v)} testID="country" />
      <SelectPicker
        label="Tags"
        multiple
        maxSelected={3}
        options={[{ label: 'React', value: 'react' }, { label: 'TypeScript', value: 'ts' }, { label: 'Expo', value: 'expo' }, { label: 'Node', value: 'node' }]}
        value={tags}
        onChange={setTags}
        clearable
      />
      <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 12, paddingVertical: 8 }}>
        <SelectList options={countries} searchable value={country} onChange={(v) => setCountry(v)} />
      </View>
      <Text testID="picked">picked: {picked}</Text>
      <PickersProvider colorScheme="dark">
        <EmojiPicker onSelect={(e) => setPicked((p) => p + e)} height={400} defaultRecent={['🔥', '👍', '😂']} />
      </PickersProvider>
    </ScrollView>
  );
}
