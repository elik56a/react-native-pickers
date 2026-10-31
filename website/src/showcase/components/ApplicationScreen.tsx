import { CountryPicker, DatePickerField, DateTimePickerField, PhoneField, SelectPicker } from '@elik56a/react-native-pickers';
import { ActionButton } from '../../home/demo/components/ActionButton';
import { AppScreen } from '../../home/demo/components/AppScreen';
import { daysFromNow, deviceSheetProps } from '../../home/demo/demo.utils';
import { useApplication } from '../hooks/useApplication';
import { APPLICATION, ROLES, SKILLS } from '../showcase.constants';
import type { ScreenProps } from '../showcase.types';
import { attentionLabel } from '../showcase.utils';

export const ApplicationScreen = ({ platform, screenHeight }: ScreenProps) => {
  const sheetProps = deviceSheetProps(platform, screenHeight);
  const form = useApplication();
  const { values, errors } = form;
  return (
    <AppScreen
      platform={platform}
      title="Apply for a role"
      subtitle={form.errorCount ? attentionLabel(form.errorCount) : 'Takes about a minute'}
      scroll
      action={<ActionButton label="Send application" busyLabel="Sending…" doneLabel="✓ Sent" validate={form.submit} />}
    >
      <SelectPicker
        label="Role"
        required
        options={ROLES}
        value={values.role}
        onChange={form.setRole}
        error={errors.role}
        sheet={{ sheetProps }}
      />
      <CountryPicker
        label="Where you live"
        required
        value={values.country}
        onChange={form.setCountry}
        error={errors.country}
        sheet={{ sheetProps }}
      />
      <PhoneField label="Phone" required value={values.phone} onChange={form.changePhone} error={errors.phone} sheet={{ sheetProps }} />
      <DatePickerField
        label="First day"
        required
        helperText="From next week"
        value={values.startDate}
        onConfirm={form.setStartDate}
        minDate={daysFromNow(APPLICATION.firstStartDay)}
        error={errors.startDate}
        sheetProps={sheetProps}
      />
      <DateTimePickerField
        label="Interview"
        required
        helperText="Before your first day"
        value={values.interview}
        onConfirm={form.setInterview}
        minDate={daysFromNow(APPLICATION.firstInterviewDay)}
        minuteInterval={APPLICATION.minuteInterval}
        error={errors.interview}
        sheetProps={sheetProps}
      />
      <SelectPicker
        label="Skills"
        required
        multiple
        helperText={`${APPLICATION.minSkills} to ${APPLICATION.maxSkills}`}
        options={SKILLS}
        value={values.skills}
        onChange={form.setSkills}
        maxSelected={APPLICATION.maxSkills}
        error={errors.skills}
        sheet={{ sheetProps }}
      />
    </AppScreen>
  );
};
