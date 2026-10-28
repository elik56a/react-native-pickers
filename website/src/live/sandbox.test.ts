import {
  canOpenInSandbox,
  findMainComponent,
  toCodeSandboxBody,
  toExampleName,
  toSnackUrl,
  toSourceUrl,
  toStackBlitzFields,
  toStackBlitzUrl,
  toWebProject,
} from './sandbox';

const code = `import { View } from 'react-native';

export default function Example() {
  return <View />;
}`;

describe('canOpenInSandbox', () => {
  it('needs a default-exported component', () => {
    expect(canOpenInSandbox(code)).toBe(true);
    expect(canOpenInSandbox('<View />;')).toBe(false);
  });
});

const datePicker = `import { DatePickerField } from '@elik56a/react-native-pickers';
import { View } from 'react-native';

export default function Example() {
  return (
    <View>
      <DatePickerField value={null} onChange={() => {}} />
    </View>
  );
}`;

describe('findMainComponent', () => {
  it('finds the first of the library components the code renders', () => {
    expect(findMainComponent(datePicker)).toBe('DatePickerField');
    expect(findMainComponent(code)).toBeUndefined();
  });
});

describe('toSourceUrl', () => {
  it("links to the main component's file on GitHub", () => {
    expect(toSourceUrl(datePicker)).toBe('https://github.com/elik56a/react-native-pickers/blob/master/src/date/DatePickerField.tsx');
    expect(toSourceUrl(code)).toBeUndefined();
  });
});

describe('toExampleName', () => {
  it("keeps the example's own name unless it's generic, then names it after its main component", () => {
    expect(toExampleName(datePicker)).toBe('DatePickerFieldExample');
    expect(toExampleName(datePicker.replace('function Example', 'function Booking'))).toBe('Booking');
    expect(toExampleName(datePicker.replace('function Example', 'function App'))).toBe('DatePickerFieldExample');
    expect(toExampleName(code)).toBe('Example');
  });
});

describe('toSnackUrl', () => {
  it('puts the example in Example.tsx, rendered by the shared App.tsx, with the package as a dependency', () => {
    const url = new URL(toSnackUrl(code));
    expect(url.origin).toBe('https://snack.expo.dev');
    expect(url.searchParams.get('dependencies')).toBe('@elik56a/react-native-pickers');
    expect(url.searchParams.get('platform')).toBe('web');
    const files = JSON.parse(url.searchParams.get('files') ?? '');
    expect(files['Example.tsx']).toEqual({ type: 'CODE', contents: code });
    expect(files['App.tsx'].contents).toContain("import Example from './Example';");
  });

  it('names the example file after its main component, and renders it under the platform the switch picks', () => {
    const files = JSON.parse(new URL(toSnackUrl(datePicker)).searchParams.get('files') ?? '');
    expect(files['DatePickerFieldExample.tsx'].contents).toBe(datePicker);
    expect(files['App.tsx'].contents).toContain("import DatePickerFieldExample from './DatePickerFieldExample';");
    expect(files['App.tsx'].contents).toContain('<PickersProvider platform={platform}>');
    expect(files['App.tsx'].contents).toContain('<HorizontalList items={platforms} value={platform} onChange={setPlatform}');
  });
});

describe('toWebProject', () => {
  it('runs the example as src/Example.tsx inside the shared App, with react-native-web', () => {
    const files = toWebProject(code);
    expect(files['src/Example.tsx']).toBe(code);
    expect(files['src/App.tsx']).toContain('<Example />');
    expect(files['vite.config.ts']).toContain("'react-native': 'react-native-web'");
    expect(JSON.parse(files['package.json']).dependencies).toHaveProperty('@elik56a/react-native-pickers');
  });

  it('opens StackBlitz on the example file', () => {
    expect(toStackBlitzUrl(datePicker)).toBe('https://stackblitz.com/run?file=src/DatePickerFieldExample.tsx');
  });

  it('becomes StackBlitz form fields and a CodeSandbox body', () => {
    expect(toStackBlitzFields(code)).toMatchObject({ 'project[template]': 'node', 'project[files][src/Example.tsx]': code });
    expect(toCodeSandboxBody(code).files['src/Example.tsx']).toEqual({ content: code });
  });
});
