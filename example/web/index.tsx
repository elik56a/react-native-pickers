import { AppRegistry } from 'react-native';
// @ts-ignore
import App from '__DEMO__';
AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });
