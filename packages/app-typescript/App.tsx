import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Typography } from './components/Typography';
import { Button } from './components/Button';

export default function App() {
  return (
    <View style={sty.container}>
      <StatusBar style="auto" />
      <Button color="secondary">
        <Typography color="white">Hello</Typography>
      </Button>
      <Button color="primary">
        <Typography color="black">Hello</Typography>
      </Button>
    </View>
  );
}

const sty = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
});
