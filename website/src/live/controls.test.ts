import { findControls, readControl, writeControl } from './controls';

const fields = `<View>
  <DatePickerField
    label="Stay"
    value={stay}
    onConfirm={setStay}
  />
  <SelectPicker label="Room" options={rooms} onClear={() => setRoom(null)} clearable />
</View>`;

const control = (code: string, prop: string) => {
  const found = findControls(code).find((c) => c.prop === prop);
  if (!found) throw new Error(`no ${prop} control`);
  return found;
};

describe('findControls', () => {
  it('offers the props of the components the code renders, one control per prop', () => {
    const props = findControls(fields).map((c) => c.prop);
    expect(props).toEqual(['presentation', 'clearable', 'disabled']);
    expect(control(fields, 'presentation')).toMatchObject({
      options: ['dropdown', 'bottomSheet', 'modal', 'auto'],
      components: ['DatePickerField', 'SelectPicker'],
    });
  });

  it('skips a prop whose requirement is missing, and code without known components', () => {
    expect(findControls('<DatePickerField label="Due" />').map((c) => c.prop)).not.toContain('clearable');
    expect(findControls('<View><Text>Hi</Text></View>')).toEqual([]);
  });

  it('does not take a longer component name for a shorter one', () => {
    expect(findControls('<WheelPickerField label="Size" />').map((c) => c.prop)).not.toContain('loop');
  });
});

describe('readControl', () => {
  it('reads string, bare and missing props', () => {
    expect(readControl(fields, control(fields, 'clearable'))).toBe(true);
    expect(readControl(fields, control(fields, 'presentation'))).toBe('dropdown');
    expect(readControl('<TimePicker format="24h" />', control('<TimePicker format="24h" />', 'format'))).toBe('24h');
  });
});

describe('writeControl', () => {
  it('adds the prop to every tag, matching one-prop-per-line indentation', () => {
    const next = writeControl(fields, control(fields, 'presentation'), 'modal');
    expect(next).toContain('<DatePickerField\n    presentation="modal"\n    label="Stay"');
    expect(next).toContain('<SelectPicker presentation="modal" label="Room"');
  });

  it('replaces a set prop, and writes booleans bare or as {false}', () => {
    const clearable = control(fields, 'clearable');
    const off = writeControl(fields, clearable, false);
    expect(off).toContain('onClear={() => setRoom(null)} clearable={false} />');
    expect(off).toContain('<DatePickerField\n    clearable={false}\n    label="Stay"');
    const on = writeControl(off, clearable, true);
    expect(on).toContain('onClear={() => setRoom(null)} clearable />');
    expect(on).toContain('<DatePickerField\n    clearable\n    label="Stay"');
  });

  it('is stable when written twice', () => {
    const presentation = control(fields, 'presentation');
    const once = writeControl(fields, presentation, 'modal');
    expect(writeControl(once, presentation, 'bottomSheet')).toBe(writeControl(fields, presentation, 'bottomSheet'));
  });
});
