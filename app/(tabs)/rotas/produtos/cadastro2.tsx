import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Cadastro1() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const cadastrar = () => {
    router.push('/rotas/inicialpessoa');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxo} />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Cadastro para Pessoa Física</Text>

        <View style={styles.card}>
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
              value={cnpj}
              onChangeText={setCnpj}
              keyboardType="numeric"
              maxLength={18}
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
        </View>

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
    width: '75%',
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