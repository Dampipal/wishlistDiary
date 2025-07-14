import { StatusBar, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SafeArea({ children }) {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']} // 👈 Bottom safe area nahi lenge
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={Platform.OS === 'android'}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
