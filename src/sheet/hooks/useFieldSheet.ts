import { createContext, useContext } from 'react';

import type { FieldSheetContextValue } from '../sheet.types';

/** How the field around a PickerSheet wants it shown; `null` outside a field. */
export const FieldSheetContext = createContext<FieldSheetContextValue | null>(null);

export const useFieldSheet = () => useContext(FieldSheetContext);
