// app/(tabs)/recuperarsenha.tsx
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { verificarEmailCadastrado } from '../rotaServidor/usuarioController';

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const enviar = async () => {
    if (email.trim() === '') {
      setErro('Digite seu e-mail antes de enviar.');
      setEnviado(false);
      return;
    }

    const existe = await verificarEmailCadastrado(email);
    if (!existe) {
      setErro('Não encontramos nenhuma conta cadastrada com este e-mail.');
      setEnviado(false);
      return;
    }

    setErro('');
    setEnviado(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.espaco} />

      <View style={styles.card}>
        <Image
          source={require('../../assets/images/vooalogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable style={styles.botao} onPress={enviar}>
          <Text style={styles.txtBotao}>Enviar</Text>
        </Pressable>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        {enviado && (
          <Text style={styles.aviso}>O link de recuperação já foi enviado para o seu e-mail.</Text>
        )}

        <Pressable style={styles.voltarLink} onPress={() => router.back()}>
          <Text style={styles.voltarTexto}>Voltar para o login</Text>
        </Pressable>
      </View>

      <Text style={styles.instrucao}>
        Digite seu <Text style={styles.negrito}>e-mail</Text> cadastrado para{'\n'}receber o link de recuperação.
      </Text>

      <View style={styles.espaco} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7B2FF7', padding: 40, justifyContent: 'center' },
  espaco: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 4, height: 4 },
  },
  logo: { width: '100%', height: 80, marginBottom: 3, alignSelf: 'center' },
  label: { color: '#111', fontSize: 16, paddingTop: 8, paddingBottom: 4 },
  input: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, fontSize: 16, color: '#111' },
  botao: { backgroundColor: '#F5BE35', padding: 12, borderRadius: 30, marginTop: 20 },
  txtBotao: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  erro: { color: '#C0392B', fontSize: 11, textAlign: 'center', marginTop: 12 },
  aviso: { color: '#000000', fontSize: 11, textAlign: 'center', marginTop: 12 },
  voltarLink: { marginTop: 14, alignItems: 'center' },
  voltarTexto: { color: '#7B2FF7', fontSize: 13, fontWeight: 'bold' },
  instrucao: { color: '#fff', fontSize: 13, textAlign: 'center', padding: 16 },
  negrito: { fontWeight: 'bold' },
});
