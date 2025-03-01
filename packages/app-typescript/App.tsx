import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styled } from './jacaranda.config';
import { Typography } from './components/Typography';
import { Button } from './components/Button';

const StyledView = styled(View)({
  flex: 1,
  backgroundColor: '$colors.white',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$space.3',
});

export default function App() {
  return (
    <StyledView>
      <StatusBar style="auto" />
      <Button color="secondary">
        <Typography color="white">Hello</Typography>
      </Button>
      <Button color="primary">
        <Typography color="black">Hello</Typography>
      </Button>
    </StyledView>
  );
}
