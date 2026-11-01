import type React from 'react';
import { useCallback, useMemo } from 'react';
import type { FlatList } from 'react-native';
import { Animated, View } from 'react-native';

import { OwnScroll } from '../core/components/OwnScroll';
import { useComponentTheme } from '../core/theme/ThemeProvider';
import { WheelIndicator } from './components/WheelIndicator';
import { WheelRow } from './components/WheelRow';
import { WheelTypingInput } from './components/WheelTypingInput';
import { useTypeToSelect } from './hooks/useTypeToSelect';
import { useWheelControls } from './hooks/useWheelControls';
import { useWheelScroll } from './hooks/useWheelScroll';
import { DEFAULT_FADE_TO, DEFAULT_ITEM_HEIGHT, DEFAULT_ROTATION_DEG, DEFAULT_VISIBLE_ITEMS, WHEEL_VARIANT } from './wheel.constants';
import { styles } from './wheel.styles';
import type { WheelPickerProps } from './wheel.types';
import { normalizeItem, toOddCount } from './wheel.utils';

export const WheelPicker = <T,>(props: WheelPickerProps<T>) => {
  const {
    items: rawItems,
    value,
    defaultValue,
    onChange,
    onValueChanging,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    visibleItems: requestedVisibleItems = DEFAULT_VISIBLE_ITEMS,
    loop = false,
    keyboardInput = true,
    variant = WHEEL_VARIANT.threeD,
    rotation = DEFAULT_ROTATION_DEG,
    fadeTo = DEFAULT_FADE_TO,
    renderItem,
    showIndicator = true,
    renderIndicator,
    textAlign = 'center',
    disabled = false,
    isEqual = Object.is,
    style,
    styles: slots,
    theme: themeProp,
    design,
    accessibilityLabel,
    testID,
  } = props;
  const { theme } = useComponentTheme(themeProp, design);
  const items = useMemo(() => rawItems.map((input) => normalizeItem<T>(input)), [rawItems]);
  const visibleItems = toOddCount(requestedVisibleItems);
  const padding = ((visibleItems - 1) / 2) * itemHeight;

  const typeToSelect = useTypeToSelect(items, (logicalIndex) => wheel.scrollToLogical(logicalIndex, true));
  const wheel = useWheelScroll({
    items,
    itemHeight,
    loop,
    value,
    defaultValue,
    isEqual,
    onChange,
    onValueChanging,
    onDragStart: typeToSelect.stopTyping,
  });
  const { active, toLogical, scrollY } = wheel;
  const { onRowPress, controlProps } = useWheelControls({
    wheel,
    toggleTyping: typeToSelect.toggleTyping,
    keyboardInput,
    disabled,
    count: items.length,
  });

  const renderRow = useCallback(
    ({ item: dataIndex }: { item: number }) => {
      const logicalIndex = toLogical(dataIndex);
      const item = items[logicalIndex];
      if (!item) return null;
      return (
        <WheelRow
          dataIndex={dataIndex}
          logicalIndex={logicalIndex}
          item={item}
          selected={dataIndex === active}
          itemHeight={itemHeight}
          visibleItems={visibleItems}
          scrollY={scrollY}
          variant={variant}
          rotation={rotation}
          fadeTo={fadeTo}
          theme={theme}
          textAlign={textAlign}
          slots={slots}
          renderItem={renderItem}
          onSelect={onRowPress}
        />
      );
    },
    [
      active,
      fadeTo,
      itemHeight,
      items,
      onRowPress,
      renderItem,
      rotation,
      scrollY,
      slots,
      textAlign,
      theme,
      toLogical,
      variant,
      visibleItems,
    ]
  );

  return (
    <View
      style={[styles.clip, disabled && styles.noCursor, { height: itemHeight * visibleItems }, style, slots?.container]}
      onLayout={wheel.onLayout}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: wheel.activeItem?.label }}
      {...controlProps}
      testID={testID}
    >
      {showIndicator && <WheelIndicator itemHeight={itemHeight} theme={theme} style={slots?.indicator} renderIndicator={renderIndicator} />}
      <OwnScroll>
        <Animated.FlatList
          ref={wheel.listRef as React.Ref<FlatList<number>>}
          data={wheel.data}
          testID={testID ? `${testID}-list` : undefined}
          keyExtractor={(dataIndex: number) => String(dataIndex)}
          renderItem={renderRow}
          extraData={active}
          getItemLayout={(_: unknown, index: number) => ({
            length: itemHeight,
            offset: padding + itemHeight * index,
            index,
          })}
          contentContainerStyle={{ paddingVertical: padding }}
          contentOffset={{ x: 0, y: wheel.initialDataIndex * itemHeight }}
          // iOS applies contentOffset without a scroll event, so the list would only render rows from 0.
          initialScrollIndex={Math.max(0, wheel.initialDataIndex - (visibleItems - 1) / 2)}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          scrollEnabled={!disabled}
          scrollEventThrottle={16}
          {...wheel.scrollHandlers}
          initialNumToRender={visibleItems + 4}
          windowSize={5}
          maxToRenderPerBatch={visibleItems * 2}
          removeClippedSubviews={false}
          nestedScrollEnabled
        />
      </OwnScroll>
      {typeToSelect.typing && (
        <WheelTypingInput
          value={typeToSelect.typed ?? ''}
          numeric={typeToSelect.numeric}
          itemHeight={itemHeight}
          theme={theme}
          accessibilityLabel={accessibilityLabel}
          onChangeText={typeToSelect.onType}
          onDone={typeToSelect.stopTyping}
        />
      )}
    </View>
  );
};
