// app/login.tsx
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const logar = () => {
    // aqui entra a validação do login com email e senha
    router.replace('/perfil'); // troca de tela sem poder voltar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Quero contratar</Text>

      <View style={styles.card}>
        {/* no lugar da logo, use o componente Image quando tiver o arquivo */}
        <Text style={styles.logo}>vooa</Text>

        <Text style={styles.label}>E-mail:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <Pressable style={styles.botao} onPress={logar}>
          <Text style={styles.txtBotao}>Logar</Text>
        </Pressable>
      </View>

      <Text style={styles.rodape}>
        Não possui login? Faça seu{' '}
        <Link href="/cadastro" style={styles.link}>cadastro.</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5BE35', padding: 40, justifyContent: 'center' },
  titulo: { color: '#7B2FF7', fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 8 },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 40,
    elevation: 8, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 4, height: 4 },
  },
  logo: { color: '#7B2FF7', fontSize: 40, fontWeight: 'bold', textAlign: 'center', padding: 8 },
  label: { color: '#111', fontSize: 16, paddingTop: 8, paddingBottom: 4 },
  input: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, fontSize: 16 },
  botao: { backgroundColor: '#7B2FF7', padding: 12, borderRadius: 30, marginTop: 20 },
  txtBotao: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  rodape: { color: '#fff', fontSize: 13, textAlign: 'center', padding: 16 },
  link: { color: '#7B2FF7', fontWeight: 'bold' },
});