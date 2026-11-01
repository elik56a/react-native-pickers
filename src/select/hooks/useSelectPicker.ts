import { useCallback, useMemo, useRef, useState } from 'react';

import { usePickerPlatform } from '../../core/theme/ThemeProvider';
import { useAnchor } from '../../sheet/hooks/useAnchor';
import { resolveFieldPresentation, shouldCollapseOnPress } from '../../sheet/sheet.utils';
import { NO_OPTIONS, SELECT_PRESENTATION } from '../select.constants';
import type { SelectOption, SelectPickerProps, SelectValueProps } from '../select.types';
import { findOptions, shouldSearchInField, toValueList } from '../select.utils';

/** Open state (plus the field's position for a dropdown), the selected options, and the value props the inner SelectList gets. */
export const useSelectPicker = <T>(props: SelectPickerProps<T>, isEqual: (a: T, b: T) => boolean) => {
  const { options = NO_OPTIONS, disabled = false, closeOnSelect = true, onOpen, onClose, onClear } = props;
  const [open, setOpen] = useState(false);
  const anchor = useAnchor();
  const [query, setQuery] = useState('');
  const known = useRef<SelectOption<T>[]>([]);
  const presentation = resolveFieldPresentation(props.presentation ?? SELECT_PRESENTATION.auto, usePickerPlatform());
  const dropdown = presentation === SELECT_PRESENTATION.dropdown;
  const searchInField = shouldSearchInField(dropdown, props.searchable, !!props.renderTrigger);

  // Search results can drop a selected option, so its label is remembered from the options it last appeared in, or came with in onChange.
  const selected = useMemo(() => {
    const found = findOptions(toValueList(props.multiple, props.value), [...options, ...known.current], isEqual);
    if (found.length > 0) known.current = found;
    return found;
  }, [isEqual, options, props.multiple, props.value]);

  const show = useCallback(() => {
    if (disabled) return;
    if (dropdown) anchor.measure();
    setOpen(true);
    onOpen?.();
  }, [anchor.measure, disabled, dropdown, onOpen]);

  const hide = useCallback(() => {
    setOpen(false);
    setQuery('');
    onClose?.();
  }, [onClose]);

  const toggle = shouldCollapseOnPress(presentation, open) ? hide : show;

  const valueProps: SelectValueProps<T> = props.multiple
    ? {
        multiple: true,
        value: props.value,
        onChange: (values, chosen) => {
          known.current = chosen;
          props.onChange?.(values, chosen);
        },
        maxSelected: props.maxSelected,
      }
    : {
        multiple: false,
        value: props.value,
        onChange: (value, option) => {
          known.current = [option];
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

  // Typing in the field, the search is ours, so clear it here as the list clears its own.
  const onCreate =
    props.onCreate &&
    ((text: string) => {
      setQuery('');
      return props.onCreate?.(text);
    });

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
    toggle,
    selected,
    valueProps,
    removeOption,
    clear,
    onCreate,
  };
};
