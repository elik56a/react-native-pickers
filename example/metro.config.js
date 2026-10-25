const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');
const config = getDefaultConfig(__dirname);
const singletons = ['react', 'react-native', 'react-dom', 'react-native-web'];

config.watchFolders = [root];

// Import the library by its package name, straight from src/, like a real consumer would.
// Singletons resolve from this app so src/ never loads the root's dev copy of react.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === pkg.name)
    return {
      type: 'sourceFile',
      filePath: path.join(root, 'src/index.ts'),
    };
  const isSingleton = singletons.some((name) => moduleName === name || moduleName.startsWith(`${name}/`));
  const ctx = isSingleton ? { ...context, originModulePath: path.join(__dirname, 'index.tsx') } : context;
  return ctx.resolveRequest(ctx, moduleName, platform);
};

module.exports = config;
