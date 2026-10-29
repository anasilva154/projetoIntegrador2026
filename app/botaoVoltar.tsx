import { TouchableOpacityComEfeito as TouchableOpacity } from '../components/botaoInterativo';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Botão redondo amarelo fixo no canto inferior esquerdo
export function BotaoVoltar() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.botao}
      activeOpacity={0.7}
      onPress={() => router.back()}
    >
      <Ionicons name="chevron-back" size={32} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    left: 12,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2BE35',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 4 },
  },
});
