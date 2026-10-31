import {
  canOpenInSandbox,
  findExampleModules,
  findMainComponent,
  toCodePenFields,
  toExampleName,
  toPenJs,
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
    expect(files['index.html']).toContain('globalThis.global = globalThis');
    expect(JSON.parse(files['package.json']).dependencies).toHaveProperty('@elik56a/react-native-pickers');
  });

  it('opens StackBlitz on the example file', () => {
    expect(toStackBlitzUrl(datePicker)).toBe('https://stackblitz.com/run?file=src/DatePickerFieldExample.tsx');
  });

  it('becomes StackBlitz form fields', () => {
    expect(toStackBlitzFields(code)).toMatchObject({ 'project[template]': 'node', 'project[files][src/Example.tsx]': code });
  });
});

const typed = `import { useState } from 'react';
import { Text } from 'react-native';
import { HorizontalList } from '@elik56a/react-native-pickers';
import { helper } from './helper';

export default function Booking() {
  const [day, setDay] = useState<string>(helper());
  return (
    <>
      <HorizontalList items={[]} value={day} onChange={setDay} />
      <Text>{day}</Text>
    </>
  );
}`;

describe('toPenJs', () => {
  const js = toPenJs(typed);

  it("strips the types but keeps the JSX, for CodePen's Babel", () => {
    expect(js).toContain('useState(helper())');
    expect(js).toContain('<Text>{day}</Text>');
    expect(js.startsWith('/** @jsxRuntime classic */')).toBe(true);
  });

  it('loads packages from esm.sh, the pickers as one bundle, leaving relative imports', () => {
    expect(js).toContain("import React from 'https://esm.sh/react@19.1.0';");
    expect(js).toContain("import { useState } from 'https://esm.sh/react@19.1.0';");
    expect(js).toContain("from 'https://esm.sh/react-native-web@0.21.4?deps=react@19.1.0,react-dom@19.1.0'");
    expect(js).toContain("from 'https://esm.sh/@elik56a/react-native-pickers?bundle&external=react,react-dom,react-native'");
    expect(js).toContain("from './helper'");
  });

  it('renders the example in the platform switch without exporting it, importing React only once', () => {
    expect(js).toContain('<Booking />');
    expect(js).toContain('<Pickers.PickersProvider platform={platform}>');
    expect(js).toContain("createRoot(document.getElementById('root')).render(<Preview />);");
    expect(js).not.toMatch(/\bexport\b/);
    expect(toPenJs(`import React from 'react';\n${code}`).match(/import React\b/g)).toHaveLength(1);
  });
});

describe('toCodePenFields', () => {
  it("is CodePen's prefill data, with the JS through Babel", () => {
    const data = JSON.parse(toCodePenFields(typed).data);
    expect(data).toMatchObject({
      title: 'React Native Pickers example: Booking',
      html: '<div id="root"></div>',
      js_pre_processor: 'babel',
    });
    expect(data.js).toBe(toPenJs(typed));
    const importMap = JSON.parse(/<script type="importmap">([\s\S]*)<\/script>/.exec(data.head)?.[1] ?? '{}');
    expect(importMap.imports['react-native']).toBe('https://esm.sh/react-native-web@0.21.4?deps=react@19.1.0,react-dom@19.1.0');
    expect(importMap.imports['react/jsx-runtime']).toBe('https://esm.sh/react@19.1.0/jsx-runtime');
  });
});

describe('example modules', () => {
  const modules = {
    DemoButton: `import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { usePickerTheme } from '@elik56a/react-native-pickers';

export const DemoButton = ({ title }: { title: string }) => <Text>{title}</Text>;`,
  };
  const withButton = `import { Text } from 'react-native';
import { DemoButton } from './DemoButton';

export default function Example() {
  return <DemoButton title="Go" />;
}`;

  it('finds only the modules the example imports', () => {
    expect(findExampleModules(withButton, modules).map(([name]) => name)).toEqual(['DemoButton']);
    expect(findExampleModules(code, modules)).toEqual([]);
  });

  it('ships them next to the example in Snack and StackBlitz', () => {
    const files = JSON.parse(new URL(toSnackUrl(withButton, modules)).searchParams.get('files') ?? '');
    expect(files['DemoButton.tsx'].contents).toBe(modules.DemoButton);
    expect(toWebProject(withButton, modules)['src/DemoButton.tsx']).toBe(modules.DemoButton);
    expect(toWebProject(code, modules)).not.toHaveProperty('src/DemoButton.tsx');
  });

  it('inlines them into the pen in their own scope, reading the namespaces the pen loads', () => {
    const js = toPenJs(withButton, modules);
    expect(js).not.toContain("from './DemoButton'");
    expect(js).toContain('const DemoButton = (() => {');
    expect(js).toContain('const { useState } = React;');
    expect(js).toContain('const { Pressable, Text } = ReactNative;');
    expect(js).toContain('const { usePickerTheme } = Pickers;');
    expect(js).not.toMatch(/\bexport\b/);
  });
});
