import { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Link, useRouter, useIsFocused } from 'expo-router';

import {
  inicializarUsuarios,
  obterUsuarioLogado,
} from '../rotaServidor/usuarioController';
import { inicializarVagas } from '../rotaServidor/vagasController';
import { inicializarCursos } from '../rotaServidor/cursosController';
import { inicializarEnvios } from '../rotaServidor/envios';

function animarPressao(escala: Animated.Value, toValue: number) {
  Animated.spring(escala, {
    toValue,
    useNativeDriver: Platform.OS !== 'web',
    speed: 18,
    bounciness: 3,
  }).start();
}

const dados = [
  {
    id: '1',
    titulo: 'Bem-vindo!',
    subtitulo: 'Encontre oportunidades que combinam com você.',
  },
];

// Topo da tela: só a imagem (logo + ilustração)
function Topo() {
  return (
    <Image
      source={require('../../assets/images/tize.png')}
      style={styles.imagem}
      resizeMode="contain"
    />
  );
}

// Rodapé da tela: botão Começar + link de login
function Rodape() {
  const [escalaComecar] = useState(() => new Animated.Value(1));
  const [escalaLogin] = useState(() => new Animated.Value(1));

  return (
    <View style={styles.rodape}>
      <Link href="/escolha" asChild>
        <Pressable
          style={styles.botaoPressable}
          onPressIn={() => animarPressao(escalaComecar, Platform.OS === 'web' ? 0.78 : 0.96)}
          onPressOut={() => animarPressao(escalaComecar, 1)}
        >
          <Animated.View
            style={[
              styles.botao,
              Platform.OS === 'web'
                ? { opacity: escalaComecar }
                : { transform: [{ scale: escalaComecar }] },
            ]}
          >
            <Text style={styles.botaoTexto}>Começar</Text>
          </Animated.View>
        </Pressable>
      </Link>

      <Text style={styles.loginTexto}>
        Já possui conta?{' '}
        <Link href="/escolhaLogin" asChild>
          <Pressable
            hitSlop={8}
            onPressIn={() => animarPressao(escalaLogin, Platform.OS === 'web' ? 0.78 : 0.96)}
            onPressOut={() => animarPressao(escalaLogin, 1)}
          >
            <Animated.View
              style={
                Platform.OS === 'web'
                  ? { opacity: escalaLogin }
                  : { transform: [{ scale: escalaLogin }] }
              }
            >
              <Text style={styles.loginLink}>Faça seu login.</Text>
            </Animated.View>
          </Pressable>
        </Link>
      </Text>
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const telaEmFoco = useIsFocused();

  useEffect(() => {
    if (!telaEmFoco) return;

    async function prepararApp() {
      await inicializarUsuarios();
      await inicializarVagas();
      await inicializarCursos();
      await inicializarEnvios();

      const usuarioLogado = await obterUsuarioLogado();
      if (!usuarioLogado) return;

      if (usuarioLogado.tipo === 'empresa') {
        router.replace('/curriculo');
      } else {
        router.replace('/rotas/inicialpessoa');
      }
    }

    prepararApp();
  }, [telaEmFoco, router]);

  const item = dados[0];

  return (
    <FlatList
      data={dados}
      keyExtractor={(i) => i.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={Topo}
      renderItem={() => (
        <View style={styles.centro}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.subtitulo}>{item.subtitulo}</Text>
        </View>
      )}
      ListFooterComponent={Rodape}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#7B2FF7',
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 44,
  },
  imagem: {
    width: '100%',
    height: 380,
    marginTop: -8,
    marginBottom: -40,
    alignSelf: 'center',
  },
  centro: {
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    color: '#FFC83D',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  rodape: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 16,
  },
  botaoPressable: {
    width: '100%',
  },
  botao: {
    backgroundColor: '#FFC83D',
    paddingVertical: 13,
    paddingHorizontal: 48,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  botaoTexto: {
    color: '#7B2FF7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 18,
  },
  loginLink: {
    color: '#FFC83D',
    fontWeight: 'bold',
  },
});
