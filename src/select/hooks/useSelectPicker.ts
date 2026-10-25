import { useCallback, useMemo, useState } from 'react';
import type { SelectOption, SelectPickerProps, SelectValueProps } from '../select.types';
import { findOptions, toValueList } from '../select.utils';

/** Sheet open state, the selected options, and the value props the inner SelectList gets. */
export const useSelectPicker = <T>(props: SelectPickerProps<T>, isEqual: (a: T, b: T) => boolean) => {
  const { options, disabled = false, closeOnSelect = true, onOpen, onClose, onClear } = props;
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => findOptions(toValueList(props.multiple, props.value), options, isEqual),
    [isEqual, options, props.multiple, props.value]
  );

  const show = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);

  const hide = useCallback(() => {
    setOpen(false);
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
    show,
    hide,
    selected,
    valueProps,
    removeOption,
    clear,
  };
};
