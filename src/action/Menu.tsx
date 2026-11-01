import { I18nManager, ScrollView, useWindowDimensions, View } from 'react-native';

import { Touchable } from '../core/components/Touchable';
import { useComponentTheme } from '../core/theme/ThemeProvider';
import { Dropdown } from '../sheet/Dropdown';
import { useDropdownFit } from '../sheet/hooks/useDropdownFit';
import { ActionSheet } from './ActionSheet';
import { MENU_ALIGN, MENU_DESIGN, MENU_PRESENTATION } from './action.constants';
import { styles } from './action.styles';
import type { MenuProps } from './action.types';
import { getMenuAnchor } from './action.utils';
import { ActionSheetHeader } from './components/ActionSheetHeader';
import { ActionSheetRow } from './components/ActionSheetRow';
import { useMenu } from './hooks/useMenu';

/** A menu of actions that drops from its trigger, or opens as an ActionSheet. Tap the trigger, or long-press it as a context menu. */
export const Menu = (props: MenuProps) => {
  const {
    actions,
    children,
    title,
    align = MENU_ALIGN.auto,
    width,
    presentation = MENU_PRESENTATION.menu,
    openOnLongPress = false,
    disabled,
    accessibilityLabel,
    style,
    styles: slots,
    theme: themeProp,
    design,
    testID,
  } = props;
  const { theme } = useComponentTheme(themeProp, design);
  const look = MENU_DESIGN[theme.design];
  const windowSize = useWindowDimensions();
  const menu = useMenu(props);
  const rect = menu.anchor.rect;
  const fit = useDropdownFit();

  return (
    <>
      <View ref={menu.anchor.ref} collapsable={false} style={style}>
        {typeof children === 'function' ? (
          children({ open: menu.open, visible: menu.visible })
        ) : (
          <Touchable
            theme={theme}
            onPress={openOnLongPress ? undefined : menu.open}
            onLongPress={openOnLongPress ? menu.open : undefined}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ expanded: menu.visible, disabled }}
            style={slots?.trigger}
            testID={testID}
          >
            {children}
          </Touchable>
        )}
      </View>
      {presentation === MENU_PRESENTATION.sheet ? (
        <ActionSheet
          visible={menu.visible}
          onClose={menu.close}
          actions={actions}
          title={title}
          styles={slots}
          theme={themeProp}
          design={design}
          testID={testID && `${testID}-menu`}
        />
      ) : (
        <Dropdown
          visible={menu.visible}
          anchor={rect && getMenuAnchor(rect, width ?? look.width, align, windowSize.width, I18nManager.isRTL)}
          onClose={menu.close}
          onClosed={menu.onClosed}
          maxHeight={fit.height}
          ready={fit.measured}
          style={slots?.menu}
          theme={themeProp}
          design={design}
          testID={testID && `${testID}-menu`}
        >
          <ScrollView style={styles.list} bounces={false} onContentSizeChange={fit.onContentSizeChange}>
            <ActionSheetHeader title={title} grouped={look.centeredTitle} theme={theme} slots={slots} />
            {actions.map((action, i) => (
              <ActionSheetRow
                key={action.label}
                action={action}
                onPress={menu.press}
                grouped={false}
                separated={look.separators && (i > 0 || !!title)}
                rowHeight={look.rowHeight}
                iconAtEnd={look.iconAtEnd}
                theme={theme}
                slots={slots}
              />
            ))}
          </ScrollView>
        </Dropdown>
      )}
    </>
  );
};
