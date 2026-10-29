import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/header';

type Matricula = {
  id: string;
  nome: string;
  curso: string;
  area: string;
  nascimento: string;
  cpf: string;
  email: string;
  telefone: string;
  escolaridade: string;
  turno: string;
  documento: {
    nome: string;
    detalhe: string;
    url: string;
  };
};

function lerMatriculas(valor: string | string[] | undefined, curso: string): Matricula[] {
  if (typeof valor !== 'string') return [];

  try {
    const dados: unknown = JSON.parse(valor);
    if (!Array.isArray(dados)) return [];

    return dados.filter(
      (item): item is Matricula =>
        item !== null &&
        typeof item === 'object' &&
        'id' in item &&
        'nome' in item &&
        'area' in item &&
        typeof item.id === 'string' &&
        typeof item.nome === 'string' &&
        typeof item.area === 'string' &&
        typeof item.curso === 'string' &&
        typeof item.nascimento === 'string' &&
        typeof item.cpf === 'string' &&
        typeof item.email === 'string' &&
        typeof item.telefone === 'string' &&
        typeof item.escolaridade === 'string' &&
        typeof item.turno === 'string' &&
        'documento' in item &&
        item.documento !== null &&
        typeof item.documento === 'object' &&
        'nome' in item.documento &&
        'detalhe' in item.documento &&
        'url' in item.documento &&
        typeof item.documento.nome === 'string' &&
        typeof item.documento.detalhe === 'string' &&
        typeof item.documento.url === 'string',
    ).map((item) => ({ ...item, curso }));
  } catch {
    return [];
  }
}

export default function AnalisarMatriculas() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    curso?: string;
    area?: string;
    matriculados?: string;
  }>();
  const curso =
    typeof params.curso === 'string'
      ? params.curso
      : 'Curso Técnico em Informática';
  const area =
    typeof params.area === 'string'
      ? params.area
      : 'Tecnologia da Informação';
  const matriculas = useMemo(
    () => lerMatriculas(params.matriculados, curso),
    [params.matriculados, curso],
  );
  const [busca, setBusca] = useState('');

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return matriculas;
    return matriculas.filter((matricula) =>
      `${matricula.nome} ${matricula.curso} ${matricula.area}`
        .toLowerCase()
        .includes(termo),
    );
  }, [busca, matriculas]);

  const cabecalho = (
    <View>
      <View style={styles.linhaTitulo}>
        <View style={styles.seloTitulo}>
          <Text style={styles.tituloTela}>Matriculados</Text>
        </View>
      </View>

      <View style={styles.blocoCurso}>
        <Text style={styles.tituloCurso}>{curso}</Text>
        {area ? <Text style={styles.areaCurso}>{area}</Text> : null}
      </View>

      <View style={styles.linhaQuantidade}>
        <Image
          source={require('../../assets/images/candidatos.png')}
          style={styles.quantidadeIcone}
          resizeMode="contain"
        />
        <Text style={styles.quantidade}>
          {matriculas.length}{' '}
          {matriculas.length === 1 ? 'pessoa matriculada' : 'pessoas matriculadas'}
        </Text>
      </View>

      <View style={styles.busca}>
        <Ionicons name="search-outline" size={22} color={stylesConstantes.preto} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar pessoa matriculada..."
          placeholderTextColor={stylesConstantes.preto}
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
      <Header />
      <View style={styles.fundoRoxo}>
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {matriculas.length === 0
                ? 'Nenhuma pessoa matriculada neste curso.'
                : 'Nenhuma pessoa encontrada.'}
            </Text>
          }
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/infomatricula',
                  params: { dados: JSON.stringify(item) },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Ver dados da matrícula de ${item.nome}`}
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
                <View style={styles.linhaMatricula}>
                  <Image
                    source={require('../../assets/images/pdf.png')}
                    style={styles.iconeMatricula}
                    resizeMode="contain"
                  />
                  <Text style={styles.textoMatricula}>Enviou a matrícula</Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={stylesConstantes.preto}
              />
            </Pressable>
          )}
        />
      </View>

      <Pressable
        style={styles.botaoVoltar}
        onPress={() => router.push('/curriculo')}
        accessibilityRole="button"
        accessibilityLabel="Voltar para currículos"
        hitSlop={10}
      >
        <Image
          source={require('../../assets/images/voltar.png')}
          style={styles.voltarIcone}
          resizeMode="contain"
        />
      </Pressable>
    </SafeAreaView>
  );
}

const stylesConstantes = {
  roxo: '#7B2FF7',
  amarelo: '#FFC83D',
  branco: '#FFFFFF',
  preto: '#000000',
  cinzaClaro: '#EDEDED',
};

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: stylesConstantes.branco },
  fundoRoxo: { flex: 1, backgroundColor: stylesConstantes.roxo },
  lista: { paddingBottom: 100 },
  linhaTitulo: { paddingHorizontal: 20, paddingTop: 20 },
  seloTitulo: {
    alignSelf: 'flex-start',
    backgroundColor: stylesConstantes.amarelo,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  tituloTela: { fontSize: 18, fontWeight: '800', color: stylesConstantes.preto },
  blocoCurso: { paddingHorizontal: 20, marginTop: 22, gap: 4 },
  tituloCurso: { fontSize: 26, fontWeight: '800', color: stylesConstantes.branco },
  areaCurso: { fontSize: 16, color: stylesConstantes.branco },
  linhaQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  quantidadeIcone: { width: 28, height: 28 },
  quantidade: { fontSize: 17, fontWeight: '700', color: stylesConstantes.branco },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: stylesConstantes.branco,
    borderRadius: 20,
    paddingHorizontal: 18,
    height: 52,
    marginHorizontal: 20,
    marginTop: 20,
  },
  buscaInput: { flex: 1, fontSize: 15, color: stylesConstantes.preto },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: stylesConstantes.branco,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginHorizontal: 20,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: stylesConstantes.cinzaClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcone: { width: 34, height: 34 },
  info: { flex: 1, gap: 5 },
  nome: { fontSize: 17, fontWeight: '800', color: stylesConstantes.preto },
  linhaMatricula: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconeMatricula: { width: 20, height: 20 },
  textoMatricula: { fontSize: 14, fontWeight: '600', color: stylesConstantes.amarelo },
  vazio: { textAlign: 'center', color: stylesConstantes.branco, padding: 32 },
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
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  voltarIcone: { width: 48, height: 48 },
});
