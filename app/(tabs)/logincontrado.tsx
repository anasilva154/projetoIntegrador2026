// app/(tabs)/logincontrado.tsx
import { Alert, View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { loginCliente } from '../rotaServidor/usuarioController';

export default function Login() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const logar = async () => {
    if (!cpf.trim() || !senha.trim()) {
      const mensagem = 'Preencha o CPF e a senha.';
      setErro(mensagem);
      Alert.alert('Campos obrigatórios', mensagem);
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      const mensagem = 'Confira se o CPF (11 números) foi informado corretamente.';
      setErro(mensagem);
      Alert.alert('CPF inválido', mensagem);
      return;
    }

    try {
      await loginCliente(cpf, senha);
      setErro('');
      router.replace('/rotas/inicialpessoa');
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Erro ao realizar login. Tente novamente.';
      setErro(mensagem);
      Alert.alert('Informações incorretas', mensagem);
    }
  };

  const preencherDadosTeste = () => {
    setCpf('123.456.789-00');
    setSenha('123456');
    setErro('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Quero ser contratado</Text>

      <View style={styles.card}>
        <Pressable onPress={preencherDadosTeste}>
          <Image
            source={require('../../assets/images/vooalogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
          placeholder="Ex: 123.456.789-00"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={14}
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry={true}
          autoCapitalize="none"
        />

        {/* Link com asChild: o Pressable vira o elemento clicável */}
        <Link href="/recuperarsenha" asChild>
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
        <Link href="/(tabs)/rotas/produtos/cadastro2" style={styles.link}>cadastro.</Link>
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
  input: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, fontSize: 16, color: '#111' },
  esqueciSenha: { color: '#000000', fontSize: 11, fontWeight: 'bold', textAlign: 'left', marginTop: 8 },
  erro: { color: '#C0392B', fontSize: 11, textAlign: 'center', marginTop: 12 },
  botao: { backgroundColor: '#F5BE35', padding: 12, borderRadius: 30, marginTop: 20 },
  txtBotao: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  rodape: { color: '#fff', fontSize: 13, textAlign: 'center', padding: 16 },
  link: { color: '#F5BE35', fontWeight: 'bold' },
});
