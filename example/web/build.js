const esbuild = require('esbuild');
const path = require('path');
esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'index.tsx')],
  bundle: true,
  outfile: path.join(__dirname, 'dist/bundle.js'),
  alias: { 'react-native': 'react-native-web', __DEMO__: path.join(__dirname, '..', process.argv[2] || 'App.tsx') },
  resolveExtensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  define: { 'process.env.NODE_ENV': '"development"', __DEV__: 'true' },
  loader: { '.js': 'jsx' },
  jsx: 'automatic',
  logLevel: 'warning',
});
require('fs').writeFileSync(path.join(__dirname, 'dist/index.html'),
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,#root{height:100%;margin:0;font-family:-apple-system,system-ui,sans-serif}</style></head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
console.log('built');
