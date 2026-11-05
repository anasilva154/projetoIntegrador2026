import { ContainerAnimado } from '../../../../components/entradaAnimada';
import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { cadastrarCliente } from '../../../rotaServidor/usuarioController';

export default function Cadastro2() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = async () => {
    if (!nome.trim() || !email.trim() || !cpf.trim() || !senha.trim() || !confirmarSenha.trim()) {
      const mensagem = 'Preencha todos os campos para concluir o cadastro.';
      setErro(mensagem);
      Alert.alert('Campos obrigatórios', mensagem);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      const mensagem = 'Informe um endereço de e-mail válido.';
      setErro(mensagem);
      Alert.alert('E-mail inválido', mensagem);
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      const mensagem = 'O CPF deve conter 11 números.';
      setErro(mensagem);
      Alert.alert('CPF inválido', mensagem);
      return;
    }

    if (senha.length < 4) {
      const mensagem = 'A senha deve ter pelo menos 4 caracteres.';
      setErro(mensagem);
      Alert.alert('Senha curta', mensagem);
      return;
    }

    if (senha !== confirmarSenha) {
      const mensagem = 'As senhas digitadas não coincidem.';
      setErro(mensagem);
      Alert.alert('Senhas diferentes', mensagem);
      return;
    }

    try {
      await cadastrarCliente({ nome, email, cpf, senha });
      setErro('');
      router.replace('/rotas/inicialpessoa');
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Não foi possível realizar o cadastro.';
      setErro(mensagem);
      Alert.alert('Erro no cadastro', mensagem);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Cadastro para Pessoa Física</Text>

        <ContainerAnimado style={styles.card}>
          <Image
            source={require('../../../../assets/images/vooa.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.campo}>
            <Text style={styles.label}>Nome Completo:</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>CPF:</Text>
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Crie uma senha:</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Confirmar Senha:</Text>
            <TextInput
              style={styles.input}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.botao}
            onPress={cadastrar}
            activeOpacity={0.85}
          >
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        </ContainerAnimado>

        <Text style={styles.rodape}>
          Já possui cadastro? Vá para o{' '}
          <Link href="/logincontrado" style={styles.link}>login.</Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const cores = {
  roxo: '#7B2FF7',
  amarelo: '#f2be35',
  cardBranco: '#FFFFFF',
  inputCinza: '#F8F8F8',
  texto: '#222222',
  branco: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.roxo,
  },
  conteudo: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  titulo: {
    color: cores.amarelo,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    width: '85%',
    backgroundColor: cores.cardBranco,
    borderRadius: 32,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  logo: {
    width: 220,
    height: 110,
    alignSelf: 'center',
    marginBottom: 14,
  },
  campo: {
    width: '82%',
    marginBottom: 10,
  },
  label: {
    color: cores.texto,
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    height: 40,
    backgroundColor: cores.inputCinza,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 12,
    fontSize: 15,
    color: cores.texto,
  },
  botao: {
    width: '82%',
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: '700',
  },
  erro: {
    color: '#C0392B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  rodape: {
    color: cores.branco,
    fontSize: 13,
    textAlign: 'center',
    padding: 16,
  },
  link: {
    color: cores.amarelo,
    fontWeight: 'bold',
  },
});
