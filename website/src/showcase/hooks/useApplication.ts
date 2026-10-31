import { useState } from 'react';

import type { PhoneDetails } from '@elik56a/react-native-pickers';
import { EMPTY_APPLICATION } from '../showcase.constants';
import type { ApplicationValues } from '../showcase.types';
import { validateApplication } from '../showcase.utils';

/** A form that shows its errors once the user tries to send it, then updates them as each field is fixed. */
export const useApplication = () => {
  const [values, setValues] = useState<ApplicationValues>(EMPTY_APPLICATION);
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validateApplication(values) : {};
  const setter =
    <K extends keyof ApplicationValues>(key: K) =>
    (value: ApplicationValues[K]) =>
      setValues((current) => ({
        ...current,
        [key]: value,
      }));

  return {
    values,
    errors,
    errorCount: Object.keys(errors).length,
    setRole: setter('role'),
    setCountry: setter('country'),
    changePhone: (phone: string, details: PhoneDetails) =>
      setValues((current) => ({
        ...current,
        phone,
        phoneValid: details.valid,
      })),
    setStartDate: setter('startDate'),
    setInterview: setter('interview'),
    setSkills: setter('skills'),
    /** Reveals the errors, and whether the application can be sent */
    submit: () => {
      setSubmitted(true);
      return Object.keys(validateApplication(values)).length === 0;
    },
  };
};
