import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../components/header';
import { Botao } from '../components/botao';
import DadosVagas from './rotaServidor/dados';

export default function Vagas() {
  const router = useRouter();

  const vagas= DadosVagas();

  return (
    <View style={styles.tela}>
      <Header />

      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>{item.titulo} - {item.salario}</Text>
              <View style={styles.cardSubtitulo}>
                <FlatList
                  data={item.topicos}
                  keyExtractor={(topico, index) => index.toString()}
                  renderItem={({ item: topico }) => (
                    <Text>{topico.descricao}</Text>
                  )}
                ></FlatList>

                <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
                  <TouchableOpacity onPress={() => router.push(`/rotas/vagas/${item.id}`)}>
                    <Text>Saiba mais</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        )}
        contentContainerStyle={styles.lista}
      />
      <View style={{ alignItems: 'center', margin: 16 }}>
        <Botao titulo="voltar" cor="#6A2BC7" onPress={() => router.back()} size="100" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#7B2CF9' },
  lista: { padding: 16, gap: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#7B2CF9' },
  cardSubtitulo: {
    width: '100%',
    marginTop: 8,
    backgroundColor: '#c9c9c9',
    borderRadius: 4,
    padding: 8,
  }
});