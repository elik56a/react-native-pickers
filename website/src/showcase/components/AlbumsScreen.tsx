import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Menu, useActionSheet, usePickerTheme } from '@elik56a/react-native-pickers';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { deviceSheetProps } from '../../home/demo/demo.utils';
import { ALBUM_SORTS, ALBUMS } from '../showcase.constants';
import { styles } from '../showcase.styles';
import type { AlbumSort, ScreenProps } from '../showcase.types';
import { sortAlbums } from '../showcase.utils';

export const AlbumsScreen = ({ platform, screenHeight }: ScreenProps) => {
  const { colors } = usePickerTheme();
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const [albums, setAlbums] = useState(ALBUMS);
  const [sort, setSort] = useState<AlbumSort>(ALBUM_SORTS[0]);
  const [notice, setNotice] = useState('Tap ⋯ on an album');
  const { show, actionSheet } = useActionSheet();

  const openMenu = (name: string) =>
    show({
      title: name,
      sheetProps,
      actions: [
        { label: 'Share', description: 'Send a link to the album', onPress: () => setNotice(`Shared “${name}”`) },
        { label: 'Rename', onPress: () => setNotice(`Renaming “${name}”`) },
        {
          label: 'Delete album',
          destructive: true,
          onPress: () => {
            setAlbums((prev) => prev.filter((album) => album.name !== name));
            setNotice(`Deleted “${name}”`);
          },
        },
      ],
    });

  return (
    <AppScreen platform={platform} title="Albums" subtitle={notice}>
      <View style={styles.settingHeader}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>Sort by</Text>
        <Menu
          title="Sort albums by"
          accessibilityLabel={`Sort by ${sort}`}
          actions={ALBUM_SORTS.map((label) => ({
            label,
            selected: label === sort,
            onPress: () => setSort(label),
          }))}
        >
          <Text style={[styles.settingValue, { color: colors.primary }]}>{sort} ▾</Text>
        </Menu>
      </View>
      {sortAlbums(albums, sort).map((album) => (
        <View key={album.name} style={styles.albumRow}>
          <View style={[styles.albumCover, { backgroundColor: colors.surface }]}>
            <Text style={styles.avatarText}>{album.emoji}</Text>
          </View>
          <View style={styles.albumText}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{album.name}</Text>
            <Text style={[styles.hint, { color: colors.textSecondary }]}>{album.photos} photos</Text>
          </View>
          <Pressable onPress={() => openMenu(album.name)} accessibilityRole="button" accessibilityLabel={`${album.name} options`}>
            <Text style={[styles.more, { color: colors.textSecondary }]}>⋯</Text>
          </Pressable>
        </View>
      ))}
      {actionSheet}
    </AppScreen>
  );
};
