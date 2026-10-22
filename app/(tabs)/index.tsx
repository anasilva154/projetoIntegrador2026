import { FlatList, View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

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
  return (
    <View style={styles.rodape}>
      <Link href="/buscar" asChild>
        <Pressable style={styles.botao}>
          <Text style={styles.botaoTexto}>Começar</Text>
        </Pressable>
      </Link>

      <Text style={styles.loginTexto}>
        Já possui cadastro?{' '}
        <Link href="/perfil" style={styles.loginLink}>
          Faça seu login.
        </Link>
      </Text>
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
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<Topo />}
        ListFooterComponent={<Rodape />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6842f1',
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
    color: '#E3DBFF',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  rodape: {
    alignItems: 'center',
    marginTop: 32,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    padding: 18,
    borderRadius: 40,
    backgroundColor: '#FFD21F',
  },
  botaoTexto: {
    color: '#2A0A8F',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginTexto: {
    color: '#E3DBFF',
    fontSize: 15,
    marginTop: 20,
  },
  loginLink: {
    color: '#FFD21F',
    fontWeight: 'bold',
  },
});