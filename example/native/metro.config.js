const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '../..');
const config = getDefaultConfig(__dirname);
const singletons = ['react', 'react-native'];

config.watchFolders = [root];

// The library's devDependencies install their own react/react-native at the repo root;
// resolve them from this app so src/ never loads a second copy.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = singletons.some((name) => moduleName === name || moduleName.startsWith(`${name}/`));
  const ctx = isSingleton ? { ...context, originModulePath: path.join(__dirname, 'index.tsx') } : context;
  return ctx.resolveRequest(ctx, moduleName, platform);
};

module.exports = config;
