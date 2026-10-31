import { TextInput, View } from 'react-native';

import { textStyle, usePickerTheme } from '../core';
import { coreStyles } from '../core/core.styles';
import { useFocus } from '../core/hooks/useFocus';
import { useDesignOverride } from '../core/theme/ThemeProvider';
import { FieldFrame } from '../sheet/components/FieldFrame';
import { FloatingLabel } from '../sheet/components/FloatingLabel';
import { DISABLED_TRIGGER_OPACITY, FIELD_DESIGN, FIELD_LABEL, FLOATING_LABEL_PADDING, FOCUS_RING_WIDTH } from '../sheet/sheet.constants';
import { styles as sheetStyles } from '../sheet/sheet.styles';
import { getFieldAccessibility } from '../sheet/sheet.utils';
import { CountryPicker } from './CountryPicker';
import { CountryButton } from './components/CountryButton';
import { DEFAULT_PHONE_LABEL, PHONE_COUNTRY_BUTTON_LABEL } from './country.constants';
import { styles } from './country.styles';
import type { PhoneFieldProps } from './country.types';
import { getCountry, getPhonePlaceholder } from './country.utils';
import { usePhoneField } from './hooks/usePhoneField';

/** A phone number field: the country's flag and calling code to pick from, then the number, grouped as the country writes it. */
export const PhoneField = (props: PhoneFieldProps) => {
  const {
    label,
    placeholder,
    disabled = false,
    error,
    helperText,
    required,
    countries,
    exclude,
    preferred,
    locale,
    preferredLabel,
    allCountriesLabel,
    presentation,
    countrySheetTitle = PHONE_COUNTRY_BUTTON_LABEL,
    sheet,
    style,
    styles: slots,
    theme: themeProp,
    design,
    testID,
  } = props;
  const themeOverride = useDesignOverride(themeProp, design);
  const theme = usePickerTheme(themeOverride);
  const phone = usePhoneField(props);
  const focus = useFocus();
  const country = getCountry(phone.country);
  const look = FIELD_DESIGN[theme.design];
  const active = focus.focused || phone.picking;
  const borderWidth = active ? look.openBorderWidth : 1;
  const invalid = !!error;
  const c = theme.colors;

  return (
    <View style={style}>
      <FieldFrame label={label} error={error} helperText={helperText} required={required} theme={theme} slots={slots}>
        <View
          style={[
            sheetStyles.trigger,
            {
              minHeight: look.minHeight,
              backgroundColor: c.background,
              borderWidth,
              borderColor: invalid ? c.danger : active ? c.primary : c[look.outline],
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.md - (borderWidth - 1),
              opacity: disabled ? DISABLED_TRIGGER_OPACITY : 1,
            },
            active && look.focusRing && { boxShadow: `0px 0px 0px ${FOCUS_RING_WIDTH}px ${c.primaryMuted}` },
            slots?.field,
          ]}
        >
          {label && look.label === FIELD_LABEL.floating ? (
            // Raised for good: the calling code sits where a resting label would.
            <FloatingLabel
              label={label}
              raised
              open={active}
              invalid={invalid}
              required={required}
              borderWidth={borderWidth}
              theme={theme}
              style={[{ marginStart: theme.spacing.md - FLOATING_LABEL_PADDING - (borderWidth - 1) }, slots?.label]}
            />
          ) : null}
          <View style={styles.phoneRow}>
            <CountryPicker
              value={phone.country}
              onChange={phone.changeCountry}
              countries={countries}
              exclude={exclude}
              preferred={preferred}
              locale={locale}
              preferredLabel={preferredLabel}
              allCountriesLabel={allCountriesLabel}
              showDialCode
              presentation={presentation}
              sheetTitle={countrySheetTitle}
              sheet={sheet}
              onOpen={phone.openPicker}
              onClose={phone.closePicker}
              disabled={disabled}
              theme={themeOverride}
              renderTrigger={({ open }) =>
                country ? (
                  <CountryButton
                    country={country}
                    open={open}
                    picking={phone.picking}
                    disabled={disabled}
                    theme={theme}
                    slots={slots}
                    testID={testID ? `${testID}-country` : undefined}
                  />
                ) : null
              }
            />
            <TextInput
              value={phone.text}
              onChangeText={phone.changeText}
              onFocus={focus.onFocus}
              onBlur={focus.onBlur}
              placeholder={placeholder ?? getPhonePlaceholder(phone.country)}
              placeholderTextColor={c.textSecondary}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              editable={!disabled}
              {...getFieldAccessibility({ name: label ?? DEFAULT_PHONE_LABEL, error, required })}
              style={[textStyle(theme, 'md'), styles.phoneInput, coreStyles.noOutline, { color: c.text }, slots?.input]}
              testID={testID}
            />
          </View>
        </View>
      </FieldFrame>
    </View>
  );
};
