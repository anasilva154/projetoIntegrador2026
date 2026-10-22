import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  const serContratado = () => {
    router.push('/(tabs)/rotas/produtos/cadastro2');
  };

  const contratar = () => {
    router.push('/(tabs)/rotas/cadastro1');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxo} />

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>O App para encontrar</Text>
        <Text style={styles.destaque}>Estagiários e Jovens Aprendizes</Text>

        <Text style={styles.descricao}>
          Antes de dar início ao seu cadastro,{'\n'}
          precisamos saber; Você gostaria de:
        </Text>

        <View style={styles.card}>
          <Image
            source={require('../../assets/images/vooa.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={[styles.botao, styles.botaoRoxo]}
            onPress={serContratado}
            activeOpacity={0.85}
          >
            <Text style={styles.textoBotao}>ser contratado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, styles.botaoAmarelo]}
            onPress={contratar}
            activeOpacity={0.85}
          >
            <Text style={styles.textoBotao}>contratar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const cores = {
  roxo: '#7B2FF7',
  roxoEscuro: '#4B1BA8',
  amarelo: '#F4C242',
  branco: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.roxo,
  },
  conteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    transform: [{ translateY: -15 }],
  },
  titulo: {
    color: cores.branco,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  destaque: {
    color: cores.amarelo,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  descricao: {
    color: cores.branco,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 24,
  },
  card: {
    width: '70%',
    backgroundColor: cores.branco,
    borderRadius: 32,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 28,
    marginTop: 55,
    transform: [{ translateY: -55 }],
    shadowColor: cores.roxoEscuro,
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 10,
  },
  logo: {
    width: 220,
    height: 110,
    alignSelf: 'center',
    marginBottom: 8,
  },
  botao: {
    width: '70%',
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  botaoRoxo: {
    backgroundColor: cores.roxo,
  },
  botaoAmarelo: {
    backgroundColor: cores.amarelo,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700',
  },
});