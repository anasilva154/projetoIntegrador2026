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

export default function Cadastro1() {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const cadastrar = () => {
    console.log('cadastrar', { nome, cnpj, senha, confirmarSenha });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.amarelo} />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Cadastro para Empresa</Text>

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
            <Text style={styles.label}>CNPJ:</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const cores = {
  roxo: '#f2be35',
  amarelo: '#7B2FF7',
  cardCinza: '#EBEBEB',
  inputCinza: '#F8F8F8',
  texto: '#222222',
  branco: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.amarelo,
  },
  conteudo: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  titulo: {
    color: cores.roxo,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  card: {
    width: '75%',
    backgroundColor: cores.cardCinza,
    borderRadius: 32,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  logo: {
    width: '100%',
    height: 70,
    marginBottom: 6,
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
    backgroundColor: cores.roxo,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: '700',
  },
});