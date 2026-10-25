// Autofix for lint/expand-returned-objects.grit: puts a line break after `{` in single-line returned
// object literals with 2+ properties; Biome then keeps them expanded, one property per line.
// Usage: node scripts/expand-returned-objects.js [files…]  (defaults to every tracked .ts/.tsx/.js under src and example)
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const files =
  process.argv.length > 2
    ? process.argv.slice(2)
    : execSync("git ls-files --cached --others --exclude-standard 'src/*.ts' 'src/*.tsx' 'example/*.ts' 'example/*.tsx' 'example/*.js'", {
        encoding: 'utf8',
      })
        .split('\n')
        .filter(Boolean);

const unwrap = (node) => {
  if (node && (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)))
    return unwrap(node.expression);
  return node;
};

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const kind = file.endsWith('x') ? ts.ScriptKind.TSX : file.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  const inserts = [];
  const line = (pos) => sf.getLineAndCharacterOfPosition(pos).line;
  const visit = (node) => {
    let returned;
    if (ts.isReturnStatement(node)) returned = unwrap(node.expression);
    if (ts.isArrowFunction(node) && !ts.isBlock(node.body)) returned = unwrap(node.body);
    if (returned && ts.isObjectLiteralExpression(returned) && returned.properties.length >= 2) {
      const start = returned.getStart(sf);
      if (line(start) === line(returned.properties[0].getStart(sf))) inserts.push(start + 1);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!inserts.length) continue;
  let out = text;
  for (const pos of inserts.sort((a, b) => b - a)) out = `${out.slice(0, pos)}\n${out.slice(pos)}`;
  fs.writeFileSync(file, out);
  console.log(`expanded ${inserts.length} in ${file}`);
}
