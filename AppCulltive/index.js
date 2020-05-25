import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {TextInput} from 'react-native';
// TextInput.defaultProps.selectionColor = '#3ea341';
TextInput.defaultProps.selectionColor = '#81c784';

AppRegistry.registerComponent(appName, () => App);
