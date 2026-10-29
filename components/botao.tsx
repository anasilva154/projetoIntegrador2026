import { TouchableOpacityComEfeito as TouchableOpacity } from './botaoInterativo';
import { Text, StyleSheet } from 'react-native';

type Props = {
  titulo: string;
  cor: string;
  onPress: () => void;
  size: number;
};

export function Botao({ titulo, cor, onPress, size }: Props) {
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: cor, width: size }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 200,
    borderRadius: 999, // botão pill
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 8,               // sombra Android
    shadowColor: '#000000',     // sombra iOS
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 4 },
  },
  texto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
