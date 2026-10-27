import { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { useAnchor } from '../../sheet/hooks/useAnchor';
import { SELECT_PRESENTATION } from '../select.constants';
import type { SelectOption, SelectPickerProps, SelectValueProps } from '../select.types';
import { findOptions, resolveSelectPresentation, toValueList } from '../select.utils';

/** Open state (plus the field's position for a dropdown), the selected options, and the value props the inner SelectList gets. */
export const useSelectPicker = <T>(props: SelectPickerProps<T>, isEqual: (a: T, b: T) => boolean) => {
  const { options, disabled = false, closeOnSelect = true, onOpen, onClose, onClear } = props;
  const [open, setOpen] = useState(false);
  const { ref: anchorRef, anchor, measure } = useAnchor();
  const [query, setQuery] = useState('');
  const presentation = resolveSelectPresentation(props.presentation ?? SELECT_PRESENTATION.auto, Platform.OS);
  const dropdown = presentation === SELECT_PRESENTATION.dropdown;
  const searchInField = dropdown && props.searchable !== false;

  const selected = useMemo(
    () => findOptions(toValueList(props.multiple, props.value), options, isEqual),
    [isEqual, options, props.multiple, props.value]
  );

  const show = useCallback(() => {
    if (disabled) return;
    if (dropdown) measure();
    setOpen(true);
    onOpen?.();
  }, [disabled, dropdown, measure, onOpen]);

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
          if (closeOnSelect) hide();
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
    anchorRef,
    anchor,
    show,
    hide,
    selected,
    valueProps,
    removeOption,
    clear,
  };
};
