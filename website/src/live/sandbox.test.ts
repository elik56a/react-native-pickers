import { canOpenInSandbox, toCodeSandboxBody, toSnackUrl, toStackBlitzFields, toWebProject } from './sandbox';

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
});

describe('toWebProject', () => {
  it('runs the example as src/Example.tsx inside the shared App, with react-native-web', () => {
    const files = toWebProject(code);
    expect(files['src/Example.tsx']).toBe(code);
    expect(files['src/App.tsx']).toContain('<Example />');
    expect(files['vite.config.ts']).toContain("'react-native': 'react-native-web'");
    expect(JSON.parse(files['package.json']).dependencies).toHaveProperty('@elik56a/react-native-pickers');
  });

  it('becomes StackBlitz form fields and a CodeSandbox body', () => {
    expect(toStackBlitzFields(code)).toMatchObject({ 'project[template]': 'node', 'project[files][src/Example.tsx]': code });
    expect(toCodeSandboxBody(code).files['src/Example.tsx']).toEqual({ content: code });
  });
});
