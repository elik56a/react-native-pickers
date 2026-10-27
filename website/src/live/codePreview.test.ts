import { toCodePreview, withCodePreview } from './codePreview';

const multiline = `const Row = () => {
  return (
    <Text />
  );
};

export default function Example() {
  const [value, setValue] = useState(1);
  return (
    <View>
      <WheelPicker value={value} />
    </View>
  );
}
`;

const inline = 'export default function Example() {\n  return <TimePicker value={time} />;\n}';

describe('toCodePreview', () => {
  it('returns the dedented JSX of a multi-line return', () => {
    expect(toCodePreview(multiline)).toBe('<View>\n  <WheelPicker value={value} />\n</View>');
  });

  it('returns a one-line return', () => {
    expect(toCodePreview(inline)).toBe('<TimePicker value={time} />');
  });

  it('is null when the file does not end with the returning component', () => {
    expect(toCodePreview('<View />;')).toBeNull();
    expect(toCodePreview('export default function Example() {\n  return (\n    <View />\n  );\n}\n\nconst styles = {};')).toBeNull();
  });
});

describe('withCodePreview', () => {
  it('puts edited JSX back at its indentation, leaving the rest of the file alone', () => {
    const next = withCodePreview(multiline, '<View>\n  <WheelPicker value={value} loop />\n\n</View>');
    expect(next).toContain('    <View>\n      <WheelPicker value={value} loop />\n\n    </View>\n  );\n}');
    expect(next.startsWith(multiline.slice(0, multiline.indexOf('    <View>')))).toBe(true);
    expect(toCodePreview(next)).toBe('<View>\n  <WheelPicker value={value} loop />\n\n</View>');
  });

  it('replaces a one-line return', () => {
    expect(withCodePreview(inline, '<TimePicker value={time} format="24h" />')).toBe(
      'export default function Example() {\n  return <TimePicker value={time} format="24h" />;\n}'
    );
  });

  it('leaves the code alone when there is no preview', () => {
    expect(withCodePreview('<View />;', '<Text />')).toBe('<View />;');
  });
});
