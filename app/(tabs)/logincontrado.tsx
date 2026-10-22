// app/login.tsx
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const logar = () => {
    if (email.trim() === '' || senha.trim() === '') {
      setErro('Preencha todos os campos.');
      return;
    }

    // aqui entra a validação de verdade com o servidor
    if (email !== 'teste@vooa.com' || senha !== '123456') {
      setErro('E-mail ou senha incorretos.');
      return;
    }

    setErro('');
    router.replace('/perfil'); // troca de tela sem poder voltar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Quero ser contratado</Text>

      <View style={styles.card}>
        <Image
          source={require('../../assets/images/vooalogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.label}>E-mail:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        {/* Link com asChild: o Pressable vira o elemento clicável */}
        <Link href="/esqueci-senha" asChild>
          <Pressable>
            <Text style={styles.esqueciSenha}>Esqueceu a senha?</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.botao} onPress={logar}>
          <Text style={styles.txtBotao}>Logar</Text>
        </Pressable>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
      </View>

      <Text style={styles.rodape}>
        Não possui login? Faça seu{' '}
        <Link href="/cadastro" style={styles.link}>cadastro.</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7B2FF7', padding: 40, justifyContent: 'center' },
  titulo: { color: '#F5BE35', fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 8 },
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
  logo: { width: '100%', height: 80, marginBottom: 3, alignSelf: 'center' },
  label: { color: '#111', fontSize: 16, paddingTop: 8, paddingBottom: 4 },
  input: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, fontSize: 16 },
  esqueciSenha: { color: '#000000', fontSize: 11, fontWeight: 'bold', textAlign: 'left', marginTop: 8 },
  erro: { color: '#C0392B', fontSize: 11, textAlign: 'center', marginTop: 12 },
  botao: { backgroundColor: '#F5BE35', padding: 12, borderRadius: 30, marginTop: 20 },
  txtBotao: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  rodape: { color: '#fff', fontSize: 13, textAlign: 'center', padding: 16 },
  link: { color: '#F5BE35', fontWeight: 'bold' },
});