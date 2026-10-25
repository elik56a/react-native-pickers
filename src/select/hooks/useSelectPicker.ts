import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HostInstance } from 'react-native';
import { Platform } from 'react-native';

import type { AnchorRect } from '../../sheet/sheet.types';
import { CLOSE_AFTER_SELECT_MS } from '../select.constants';
import type { SelectOption, SelectPickerProps, SelectValueProps } from '../select.types';
import { findOptions, resolveSelectPresentation, toValueList } from '../select.utils';

/** Open state (plus the field's position for a dropdown), the selected options, and the value props the inner SelectList gets. */
export const useSelectPicker = <T>(
  props: SelectPickerProps<T>,
  isEqual: (a: T, b: T) => boolean,
  anchorRef: RefObject<HostInstance | null>
) => {
  const { options, disabled = false, closeOnSelect = true, onOpen, onClose, onClear } = props;
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [query, setQuery] = useState('');
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const presentation = resolveSelectPresentation(props.presentation ?? 'auto', Platform.OS);
  const dropdown = presentation === 'dropdown';
  const searchInField = dropdown && props.searchable !== false;

  const selected = useMemo(
    () => findOptions(toValueList(props.multiple, props.value), options, isEqual),
    [isEqual, options, props.multiple, props.value]
  );

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const show = useCallback(() => {
    if (disabled) return;
    clearTimeout(closeTimer.current);
    if (dropdown) {
      anchorRef.current?.measureInWindow((x, y, width, height) =>
        setAnchor({
          x,
          y,
          width,
          height,
        })
      );
    }
    setOpen(true);
    onOpen?.();
  }, [anchorRef, disabled, dropdown, onOpen]);

  const hide = useCallback(() => {
    setOpen(false);
    setQuery('');
    onClose?.();
  }, [onClose]);

  const valueProps: SelectValueProps<T> = props.multiple
    ? {
        multiple: true,
        value: props.value,
        onChange: props.onChange,
        maxSelected: props.maxSelected,
      }
    : {
        multiple: false,
        value: props.value,
        onChange: (value, option) => {
          props.onChange?.(value, option);
          if (closeOnSelect) closeTimer.current = setTimeout(hide, CLOSE_AFTER_SELECT_MS);
        },
      };

  const removeOption = (option: SelectOption<T>) => {
    if (!props.multiple) return;
    props.onChange?.(
      (props.value ?? []).filter((v) => !isEqual(v, option.value)),
      selected.filter((s) => !isEqual(s.value, option.value))
    );
  };

  const clear = () => {
    if (props.multiple) props.onChange?.([], []);
    onClear?.();
  };

  return {
    open,
    presentation,
    searchInField,
    query,
    setQuery,
    anchor,
    show,
    hide,
    selected,
    valueProps,
    removeOption,
    clear,
  };
};
