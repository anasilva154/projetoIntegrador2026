// app/(tabs)/index.tsx
import { useMemo, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ---------- cores ---------- */
const cores = {
  roxo: '#7B2FF7',
  cinzaClaro: '#EDEDED',
  roxoVibrante: '#7B2FF7',
  vidro: 'rgba(255,255,255,0.18)',
  circulo: 'rgba(255,255,255,0.10)',
  amarelo: '#FFC83D',
  titulo: '#25164F',
  texto: '#6B6B80',
  branco: '#FFFFFF',
  preto: '#000000',
};

/* ---------- dados de exemplo ---------- */
type Vaga = {
  id: string;
  titulo: string;
  area: string;
};

const vagas: Vaga[] = [
  { id: '1', titulo: 'Estagiário de TI', area: 'Tecnologia da Informação' },
  { id: '2', titulo: 'Auxiliar Administrativo', area: 'Administrativo' },
  { id: '4', titulo: 'Desenvolvedor Front-end', area: 'Tecnologia da Informação' },
  { id: '5', titulo: 'Assistente de Marketing', area: 'Marketing' },
  { id: '6', titulo: 'Jovem Aprendiz - Auxiliar', area: 'Administrativo' },
];

const areas = ['Todos', 'Tecnologia da Informação', 'Marketing', 'Administrativo'];

/* ---------- tela ---------- */
export default function Inicio() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('Todos');

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return vagas.filter((v) => {
      const bateArea = areaSelecionada === 'Todos' || v.area === areaSelecionada;
      const bateBusca =
        termo === '' ||
        v.titulo.toLowerCase().includes(termo) ||
        v.area.toLowerCase().includes(termo);
      return bateArea && bateBusca;
    });
  }, [busca, areaSelecionada]);

  const cabecalho = (
    <View>
      {/* título */}
      <View style={styles.saudacao}>
        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          Aqui você encontra os{' '}
          <Text style={styles.destaque}>currículos dos candidatos</Text> e pode avaliar cada um
          deles.
        </Text>
      </View>

      {/* busca */}
      <View style={styles.busca}>
        <Ionicons name="search-outline" size={22} color={cores.branco} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar vaga ou área..."
          placeholderTextColor="rgba(255,255,255,0.8)"
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
        />
      </View>

      {/* filtros */}
      <FlatList
        data={areas}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => {
          const ativo = item === areaSelecionada;
          return (
            <Pressable
              onPress={() => setAreaSelecionada(item)}
              style={[styles.chip, ativo && styles.chipAtivo]}
            >
              <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{item}</Text>
            </Pressable>
          );
        }}
      />

      <View style={{ height: 16 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      {/* barra de topo branca (fixa) */}
      <View style={styles.topo}>
        <Image
          source={require('../../assets/images/vooalogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.perfil}>
          <Ionicons name="person" size={24} color={cores.branco} />
        </View>
      </View>

      {/* área roxa */}
      <View style={styles.fundoRoxo}>
        <View pointerEvents="none" style={styles.circuloGrande} />

        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhuma vaga encontrada.</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() => router.push(`/candidato/${item.id}`)}
            >
              <View style={styles.avatar}>
                <Ionicons name="briefcase-outline" size={22} color={cores.preto} />
              </View>

              <View style={styles.info}>
                <Text style={styles.nome}>{item.titulo}</Text>
                <Text style={styles.cargo}>{item.area}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={cores.preto} />
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco },

   topo: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  logo: { width: 80, height: 100, marginTop: 10 },
    perfil: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: cores.roxoVibrante,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fundoRoxo: { flex: 1, backgroundColor: cores.roxo, overflow: 'hidden' },

  saudacao: { paddingHorizontal: 20, paddingTop: 20, gap: 8 },
  titulo: { fontSize: 32, fontWeight: '800', color: cores.branco, lineHeight: 38 },
  subtitulo: { fontSize: 16, color: cores.branco, lineHeight: 23 },
  destaque: { color: cores.amarelo, fontWeight: '700' },

  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.vidro,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
    marginHorizontal: 20,
    marginTop: 20,
  },
  buscaInput: { flex: 1, fontSize: 15, color: cores.branco },

  chips: { paddingHorizontal: 20, gap: 8, paddingTop: 16 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: cores.vidro,
  },
  chipAtivo: { backgroundColor: cores.branco },
  chipTexto: { fontSize: 14, color: cores.branco, fontWeight: '600' },
  chipTextoAtivo: { color: cores.roxoVibrante, fontWeight: '800' },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.branco,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.cinzaClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  nome: { fontSize: 16, fontWeight: '800', color: cores.titulo },
  cargo: { fontSize: 14, color: cores.texto },

  vazio: { textAlign: 'center', color: cores.branco, padding: 32 },
});