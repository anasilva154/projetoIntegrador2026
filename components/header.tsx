import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// props = "entradas" que o componente recebe de fora
type Props = { nome?: string };

export function Header({ nome = 'nome do usuario' }: Props) {
  return (
    <View style={styles.header}>
      {/* Logo (imagem local) */}
      <Image
        source={require('../assets/images/logovooa.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Nome + avatar */}
      <View style={styles.usuario}>
        <Text style={styles.nome}>{nome}</Text>
        <View style={styles.avatar}>
          <Ionicons name="person" size={26} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logo: { width: 78, height: 32 },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nome: {
    color: '#F2BE35',
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // metade = círculo perfeito
    backgroundColor: '#7B2CF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
