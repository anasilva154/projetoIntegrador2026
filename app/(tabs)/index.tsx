import { PressableComEfeito as Pressable } from '../../components/botaoInterativo';
import { useRef } from 'react';
import { Animated, FlatList, View, Text, Image, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { AnimacaoConteudoPagina } from '../../components/animacaoConteudoPagina';


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
  const escalaComecar = useRef(new Animated.Value(1)).current;
  const escalaLogin = useRef(new Animated.Value(1)).current;

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

      <View style={styles.loginRow}>
        <Text style={styles.loginTexto}>Já possui cadastro?</Text>
        <Link href="/escolhaLogin" asChild>
          <Pressable
            style={styles.loginPressable}
            onPressIn={() => animarPressao(escalaLogin, Platform.OS === 'web' ? 0.72 : 0.96)}
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
      </View>
    </View>
  );
}

// Como desenhar cada item da lista
function renderItem({ item }: { item: (typeof dados)[number] }) {
  return (
    <View style={styles.textos}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.subtitulo}>{item.subtitulo}</Text>
    </View>
  );
}

export default function Boasvindas() {
  return (

      <View style={styles.container}>
        <AnimacaoConteudoPagina><FlatList
          data={dados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={<Topo />}
          ListFooterComponent={<Rodape />}
        /></AnimacaoConteudoPagina>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B2FF7',
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  imagem: {
    width: '100%',
    height: 440,
  },
  textos: {
    alignItems: 'center',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  rodape: {
    alignItems: 'center',
    marginTop: 32,
  },
  botaoPressable: { width: '100%' },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    padding: 18,
    borderRadius: 40,
    backgroundColor: '#F4C242',
  },
  botaoTexto: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginTexto: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 20,
  },
  loginPressable: { alignItems: 'center', justifyContent: 'center' },
  loginLink: {
    color: '#FFD21F',
    fontWeight: 'bold',
  },
});