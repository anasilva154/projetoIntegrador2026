import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../components/header';
import { Botao } from '../components/botao';

const vagas = [
  { id: '1', titulo: 'Desenvolvedor Júnior' },
  { id: '2', titulo: 'Analista de Suporte' },
];

export default function Vagas() {
  const router = useRouter();

  return (
    <View style={styles.tela}>
      <Header />

      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>{item.titulo}</Text>
          </View>
        )}
        contentContainerStyle={styles.lista}
      />

      <Botao titulo="voltar" cor="#6A2BC7" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#7B2CF9' },
  lista: { padding: 16, gap: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#7B2CF9' },
});