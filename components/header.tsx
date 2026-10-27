import { View, Image, StyleSheet } from 'react-native';

export function Header() {
  return (
    <View style={styles.topo}>
      <Image
        source={require('../assets/images/logovooa.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topo: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  logo: { width: 80, height: 100, marginTop: 10 },
});
