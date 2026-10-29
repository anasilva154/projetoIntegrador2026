import { PressableComEfeito as Pressable } from '../../components/botaoInterativo';
// app/candidato/[id].tsx
import { useMemo, useState } from 'react';
import { FlatList, View, Text, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/header';
import { AnimacaoConteudoPagina } from '../../components/animacaoConteudoPagina';


/* ---------- cores ---------- */
const cores = {
  roxo: '#7B2FF7',
  cinzaClaro: '#EDEDED',
  vidro: 'rgba(255,255,255,0.18)',
  amarelo: '#FFC83D',
  titulo: '#7B2FF7',
  texto: '#7B2FF7',
  branco: '#FFFFFF',
  preto: '#000000',
};

/* ---------- dados de exemplo ---------- */
const vaga = {
  titulo: 'Jovem Aprendiz - Auxiliar',
  area: 'Administrativo',
};

type Candidato = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  bairro: string;
  curriculo: {
    nome: string;
    detalhe: string;
    url: string;
  };
};

const candidatos: Candidato[] = [
  {
    id: '1',
    nome: 'Ana Beatriz',
    email: 'ana.beatriz@example.com',
    telefone: '(48) 90000-0001',
    idade: '19 anos',
    bairro: 'Centro',
    curriculo: { nome: 'Curriculo_Ana_Beatriz.pdf', detalhe: 'Arquivo demonstrativo', url: '' },
  },
  {
    id: '2',
    nome: 'João Pedro',
    email: 'joao.pedro@example.com',
    telefone: '(48) 90000-0002',
    idade: '21 anos',
    bairro: 'Trindade',
    curriculo: { nome: 'Curriculo_Joao_Pedro.pdf', detalhe: 'Arquivo demonstrativo', url: '' },
  },
  {
    id: '3',
    nome: 'Maria Clara',
    email: 'maria.clara@example.com',
    telefone: '(48) 90000-0003',
    idade: '20 anos',
    bairro: 'Itacorubi',
    curriculo: { nome: 'Curriculo_Maria_Clara.pdf', detalhe: 'Arquivo demonstrativo', url: '' },
  },
  {
    id: '4',
    nome: 'Lucas Ferreira',
    email: 'lucas.ferreira@example.com',
    telefone: '(48) 90000-0004',
    idade: '22 anos',
    bairro: 'Saco dos Limões',
    curriculo: { nome: 'Curriculo_Lucas_Ferreira.pdf', detalhe: 'Arquivo demonstrativo', url: '' },
  },
];

function lerCandidatos(valor: string | string[] | undefined): Candidato[] {
  if (typeof valor !== 'string') return [];

  try {
    const dados: unknown = JSON.parse(valor);
    if (!Array.isArray(dados)) return [];

    return dados.filter(
      (item): item is Candidato =>
        item !== null &&
        typeof item === 'object' &&
        'id' in item &&
        'nome' in item &&
        'email' in item &&
        'telefone' in item &&
        'idade' in item &&
        'bairro' in item &&
        'curriculo' in item &&
        typeof item.id === 'string' &&
        typeof item.nome === 'string' &&
        typeof item.email === 'string' &&
        typeof item.telefone === 'string' &&
        typeof item.idade === 'string' &&
        typeof item.bairro === 'string' &&
        item.curriculo !== null &&
        typeof item.curriculo === 'object' &&
        'nome' in item.curriculo &&
        'detalhe' in item.curriculo &&
        'url' in item.curriculo &&
        typeof item.curriculo.nome === 'string' &&
        typeof item.curriculo.detalhe === 'string' &&
        typeof item.curriculo.url === 'string',
    );
  } catch {
    return [];
  }
}

/* ---------- tela ---------- */
export default function Candidatos() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    vaga?: string;
    area?: string;
    candidatos?: string;
  }>();
  const [busca, setBusca] = useState('');
  const tituloVaga = typeof params.vaga === 'string' ? params.vaga : vaga.titulo;
  const areaVaga = typeof params.area === 'string' ? params.area : vaga.area;
  const listaCandidatos = useMemo(() => {
    return typeof params.candidatos === 'string'
      ? lerCandidatos(params.candidatos)
      : candidatos;
  }, [params.candidatos]);

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (termo === '') return listaCandidatos;
    return listaCandidatos.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [busca, listaCandidatos]);

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
        <Text style={styles.tituloVaga}>{tituloVaga}</Text>
        <Text style={styles.empresa}>{areaVaga}</Text>
      </View>

      {/* quantidade */}
      <View style={styles.linhaQuantidade}>
        <Image
          source={require('../../assets/images/candidatos.png')}
          style={styles.quantidadeIcone}
          resizeMode="contain"
        />
        <Text style={styles.quantidade}>
          {listaCandidatos.length}{' '}
          {listaCandidatos.length === 1 ? 'candidato' : 'candidatos'}
        </Text>
      </View>

      {/* busca (branca) */}
      <View style={styles.busca}>
        <Ionicons name="search-outline" size={24} color={cores.preto} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar candidato..."
          placeholderTextColor={cores.preto}
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
      <Header />


        <AnimacaoConteudoPagina>{/* área roxa */}
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
                  router.push({
                    pathname: '/pdfcurriculo',
                    params: { candidato: JSON.stringify(item) },
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel={`Abrir currículo de ${item.nome}`}
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

                <Ionicons name="chevron-forward" size={20} color={cores.preto} />
              </Pressable>
            )}
          />
        </View>

        {/* Botão de voltar: leva direto para a tela de currículo.tsx */}
        <Pressable style={styles.botaoVoltar} onPress={() => router.push('/curriculo')} hitSlop={10}>
          <Image
            source={require('../../assets/images/voltar.png')}
            style={styles.voltarIcone}
            resizeMode="contain"
          />
        </Pressable></AnimacaoConteudoPagina>

    </SafeAreaView>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco },

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
  quantidadeIcone: { width: 28, height: 28 },
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
  buscaInput: { flex: 1, fontSize: 16, color: cores.preto },

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
  nome: { fontSize: 18, fontWeight: '800', color: cores.preto },
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
    backgroundColor: '#F7C32E',
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