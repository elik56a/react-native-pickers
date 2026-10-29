import { useState } from 'react';
import { Animated, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import type { DesignPreference } from '@elik56a/react-native-pickers';
import { HorizontalList, usePickerTheme } from '@elik56a/react-native-pickers';
import { PLAYGROUNDS } from '../../../website/src/catalog/playgrounds';
import { ShowcaseApp } from '../../../website/src/showcase/ShowcaseApp';
import { CATALOG_PAGES, DESIGN_OPTIONS, DEVICE_PLATFORM, MENU_ICON, WIDE_WIDTH } from '../example.constants';
import { styles } from '../example.styles';
import type { Insets, Route } from '../example.types';
import { useDrawerPresence } from '../hooks/useDrawerPresence';
import { Drawer } from './Drawer';
import { PlaygroundCard } from './PlaygroundCard';

interface LayoutProps {
  insets: Insets;
  design: DesignPreference;
  onDesignChange: (design: DesignPreference) => void;
}

/** The drawer beside the page on wide screens, behind a menu button on phones; the page shows a component's playgrounds or a showcase screen. */
export const Layout = ({ insets, design, onDesignChange }: LayoutProps) => {
  const { colors } = usePickerTheme();
  const wide = useWindowDimensions().width >= WIDE_WIDTH;
  const [route, setRoute] = useState<Route>(() => ({ page: CATALOG_PAGES[0].page }));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const floating = useDrawerPresence(drawerOpen && !wide);

  const select = (next: Route) => {
    setRoute(next);
    setDrawerOpen(false);
  };

  const drawerStyle = [styles.drawer, { backgroundColor: colors.background, borderRightColor: colors.border }];
  const drawer = <Drawer route={route} onSelect={select} topInset={insets.top} />;

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      {wide ? <View style={drawerStyle}>{drawer}</View> : null}
      <View style={styles.main}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          {wide ? null : (
            <Pressable accessibilityRole="button" accessibilityLabel="Menu" onPress={() => setDrawerOpen(true)} style={styles.menuButton}>
              <Text style={[styles.menuIcon, { color: colors.text }]}>{MENU_ICON}</Text>
            </Pressable>
          )}
          <Text style={[styles.title, { color: colors.text }]}>{route.page ? route.page.label : route.showcase.title}</Text>
        </View>
        <View style={styles.design}>
          <HorizontalList items={DESIGN_OPTIONS} value={design} onChange={onDesignChange} />
        </View>
        {route.page ? (
          <ScrollView key={route.page.doc} contentContainerStyle={[styles.page, { paddingBottom: insets.bottom + 16 }]}>
            {route.page.playgrounds.map((key) => (
              <PlaygroundCard key={key} config={PLAYGROUNDS[key]} wide={wide} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.showcase}>
            <ShowcaseApp key={route.showcase.key} screen={route.showcase.key} colorMode="auto" design={design} platform={DEVICE_PLATFORM} />
          </View>
        )}
      </View>
      {floating.mounted ? (
        <View style={styles.drawerOverlay}>
          <Animated.View style={[styles.backdrop, { backgroundColor: colors.backdrop }, floating.backdropStyle]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              onPress={() => setDrawerOpen(false)}
              style={styles.fill}
            />
          </Animated.View>
          <Animated.View style={[drawerStyle, styles.drawerFloating, floating.panelStyle]}>{drawer}</Animated.View>
        </View>
      ) : null}
    </View>
  );
};
