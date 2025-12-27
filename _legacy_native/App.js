import { StyleSheet, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SetHomeLocation from './screens/SetHome';
import AppWrapper from './screens/AppWrapper';

export default function App() {
  return (
    <AppWrapper />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '100%',
    alignSelf: 'center',
  },
});