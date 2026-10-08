// app/candidato/[id].tsx
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
  roxo: '#6C3AEA',
  cinzaClaro: '#EDEDED',
  vidro: 'rgba(255,255,255,0.18)',
  amarelo: '#FFC83D',
  titulo: '#25164F',
  texto: '#6B6B80',
  branco: '#FFFFFF',
  preto: '#000000',
};

/* ---------- dados de exemplo ---------- */
const vaga = {
  titulo: 'Jovem Aprendiz - Auxiliar',
  empresa: 'Nova Geração Soluções',
};

type Candidato = {
  id: string;
  nome: string;
};

const candidatos: Candidato[] = [
  { id: '1', nome: 'Ana Beatriz' },
  { id: '2', nome: 'João Pedro' },
  { id: '3', nome: 'Maria Clara' },
  { id: '4', nome: 'Lucas Ferreira' },
];

/* ---------- tela ---------- */
export default function Candidatos() {
  const router = useRouter();
  const [busca, setBusca] = useState('');

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (termo === '') return candidatos;
    return candidatos.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [busca]);

  const cabecalho = (
    <View>
      {/* título (com fundo arredondado amarelo) */}
      <View style={styles.linhaTitulo}>
        <View style={styles.seloTitulo}>
          <Text style={styles.tituloTela}>Candidatos</Text>
        </View>
      </View>

      {/* vaga */}
      <View style={styles.blocoVaga}>
        <Text style={styles.tituloVaga}>{vaga.titulo}</Text>
        <Text style={styles.empresa}>{vaga.empresa}</Text>
      </View>

      {/* quantidade */}
      <View style={styles.linhaQuantidade}>
        <Ionicons name="people" size={28} color={cores.branco} />
        <Text style={styles.quantidade}>{candidatos.length} candidatos</Text>
      </View>

      {/* busca (branca) */}
      <View style={styles.busca}>
        <Ionicons name="search-outline" size={24} color={cores.texto} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar candidato..."
          placeholderTextColor={cores.texto}
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
        />
      </View>

      <View style={{ height: 20 }} />
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
        <Pressable
          style={styles.botaoPerfil}
          onPress={() => {
            // TODO: navegar para a tela de perfil, ex: router.push('/perfil')
          }}
          hitSlop={10}
        >
          <Image
            source={require('../../assets/images/do-utilizador.png')}
            style={styles.perfilIcone}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* área roxa */}
      <View style={styles.fundoRoxo}>
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum candidato encontrado.</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => {
                // TODO: abrir o currículo do candidato, ex: router.push(`/curriculo/${item.id}`)
              }}
            >
              <View style={styles.avatar}>
                <Image
                  source={require('../../assets/images/iconeperfil.png')}
                  style={styles.avatarIcone}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.nome}>{item.nome}</Text>
                <View style={styles.linhaCurriculo}>
                  <Image
                    source={require('../../assets/images/pdf.png')}
                    style={styles.pdfIcone}
                    resizeMode="contain"
                  />
                  <Text style={styles.textoCurriculo}>Enviou currículo</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={24} color={cores.titulo} />
            </Pressable>
          )}
        />
      </View>

      {/* Botão de voltar: círculo roxo com sombra e ícone PNG por cima */}
      <Pressable style={styles.botaoVoltar} onPress={() => router.back()} hitSlop={10}>
        <Image
          source={require('../../assets/images/voltar.png')}
          style={styles.voltarIcone}
          resizeMode="contain"
        />
      </Pressable>
    </SafeAreaView>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco },

  topo: {
    height: 56,
    backgroundColor: cores.branco,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  logo: { width: 80, height: 100, marginTop: 10 },
  botaoPerfil: { alignItems: 'center', justifyContent: 'center' },
  perfilIcone: { width: 40, height: 27 },

  fundoRoxo: { flex: 1, backgroundColor: cores.roxo },

  linhaTitulo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // fundo arredondado amarelo
  seloTitulo: {
    alignSelf: 'flex-start',
    backgroundColor: cores.amarelo,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  tituloTela: { fontSize: 18, fontWeight: '800', color: cores.preto },

  blocoVaga: { paddingHorizontal: 20, marginTop: 22, gap: 4 },
  tituloVaga: { fontSize: 28, fontWeight: '800', color: cores.branco },
  empresa: { fontSize: 18, color: cores.branco },

  linhaQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 28,
  },
  quantidade: { fontSize: 18, fontWeight: '700', color: cores.branco },

  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: cores.branco,
    borderRadius: 20,
    paddingHorizontal: 18,
    height: 52,
    marginHorizontal: 20,
    marginTop: 20,
  },
  buscaInput: { flex: 1, fontSize: 16, color: cores.titulo },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: cores.branco,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginHorizontal: 20,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: cores.cinzaClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcone: { width: 36, height: 36 },
  info: { flex: 1, gap: 4 },
  nome: { fontSize: 18, fontWeight: '800', color: cores.titulo },
  linhaCurriculo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pdfIcone: { width: 20, height: 20 },
  textoCurriculo: { fontSize: 15, fontWeight: '600', color: cores.amarelo },

  vazio: { textAlign: 'center', color: cores.branco, padding: 32 },

  // círculo roxo com sombra (igual ao da tela da vaga)
  botaoVoltar: {
    position: 'absolute',
    bottom: 50,
    left: 6,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7B2FF7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // sombra no iOS
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8, // sombra no Android
  },
  voltarIcone: { width: 48, height: 48 },
});