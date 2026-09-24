// app/index.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Bemvindo() {
  return (
    <View style={styles.container}>
      {/* espaço onde fica a ilustração */}
      <View style={styles.espaco} />

      <Text style={styles.titulo}>Bem-vindo</Text>
      <Text style={styles.texto}>Se não possuir login, faça o seu cadastro.</Text>

      {/* Link com asChild: o Pressable vira o elemento clicável */}
      <Link href="/cadastro" asChild>
        <Pressable style={styles.botao}>
          <Text style={styles.txtBotao}>Cadastre-se</Text>
        </Pressable>
      </Link>

      <Text style={styles.rodape}>
        Já possui cadastro? Faça seu{' '}
        <Link href="/login" style={styles.link}>login.</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7B2FF7', padding: 40 },
  espaco: { flex: 1 },
  titulo: { color: '#F7C32E', fontSize: 20, fontWeight: 'bold', padding: 4 },
  texto: { color: '#fff', fontSize: 15, padding: 4 },
  botao: {
    backgroundColor: '#F7C32E',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    alignSelf: 'center', // botão acompanha o tamanho do texto
    marginTop: 24,       // espaço entre o texto acima e o botão
  },
  txtBotao: { color: '#111', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  rodape: { color: '#fff', fontSize: 13, textAlign: 'center', padding: 16 },
  link: { fontWeight: 'bold' },
});