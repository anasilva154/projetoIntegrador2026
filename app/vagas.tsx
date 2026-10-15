import { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/header';
import DadosVagas from './rotaServidor/dados';

const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function Vagas() {
  const router = useRouter();

  const vagas = useMemo(() => DadosVagas(), []);
  const [busca, setBusca] = useState('');

  const vagasFiltradas = useMemo(() => {
    const termo = normalizar(busca);
    if (termo === '') return vagas;
    return vagas.filter(
      (v) =>
        normalizar(v.titulo).includes(termo) ||
        normalizar(v.empresa).includes(termo) ||
        normalizar(v.categoria).includes(termo)
    );
  }, [vagas, busca]);

  return (
    <View style={styles.tela}>
      <Header />

      <View style={styles.buscaContainer}>
        <Ionicons name="search-outline" size={22} color="#666666" />
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar vaga ou área..."
          placeholderTextColor="#999999"
          value={busca}
          onChangeText={setBusca}
          returnKeyType="search"
          autoCorrect={false}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')} hitSlop={10}>
            <Ionicons name="close-circle" size={20} color="#999999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={vagasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.tituloLinha}>
              <Text style={styles.bolinhaTitulo}>•</Text>
              <Text style={styles.titulo} numberOfLines={1}>
                {item.titulo}
              </Text>
            </View>
            <Text style={styles.empresa} numberOfLines={1}>
              {item.empresa}
            </Text>

            <View style={styles.cardSubtitulo}>
              {item.topicos.slice(0, 4).map((topico, index) => (
                <View key={index} style={styles.topicoLinha}>
                  <Text style={styles.bolinhaTopico}>•</Text>
                  <Text style={styles.topicoTexto} numberOfLines={1}>
                    {topico.descricao}
                  </Text>
                </View>
              ))}

              <View style={styles.saibaMaisContainer}>
                <TouchableOpacity onPress={() => router.push(`/rotas/vagas/${item.id}`)}>
                  <Text style={styles.saibaMais}>Saiba mais</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma vaga encontrada.</Text>}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
        <Image
          source={require('../assets/images/voltar.png')}
          style={styles.iconeVoltar}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#7B2CF9',
  },

  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    marginTop: 24,
    marginBottom: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  inputBusca: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    paddingVertical: 0,
  },

  lista: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },

  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  bolinhaTitulo: {
    fontSize: 20,
    color: '#000',
    marginRight: 8,
  },
  titulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  empresa: {
    fontSize: 14,
    color: '#A0A0A0',
    marginLeft: 28,
    marginTop: 4,
    marginBottom: 10,
  },

  cardSubtitulo: {
    width: '100%',
    backgroundColor: '#EBEBEB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  topicoLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  bolinhaTopico: {
    fontSize: 12,
    color: '#000',
    marginRight: 8,
    lineHeight: 18,
  },
  topicoTexto: {
    flex: 1,
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
  },

  saibaMaisContainer: {
    alignItems: 'flex-end',
    marginTop: 14,
  },
  saibaMais: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#9A9A9A',
    textDecorationLine: 'underline',
  },

  vazio: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 30,
  },

  botaoVoltar: {
   position: 'absolute',
    left: 6,
    bottom: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFC83D',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  iconeVoltar: {
    width: 48,
    height: 48,
  },
});