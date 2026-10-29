// app/(tabs)/index.tsx
import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../components/header';
import { RodapeFlutuante } from '../../components/rodapeperfil';
 
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
  candidatos: number;
};
 
type MatriculaEnviada = {
  id: string;
  nome: string;
  curso: string;
  area: string;
};

type CursoComMatriculas = {
  tipo: 'matricula';
  id: string;
  curso: string;
  area: string;
  alunos: MatriculaEnviada[];
};

type ItemEnvio =
  | { tipo: 'curriculo'; id: string; titulo: string; area: string; candidatos: number }
  | CursoComMatriculas;
 
const vagas: Vaga[] = [
  { id: '1', titulo: 'Estagiário de TI', area: 'Tecnologia da Informação', candidatos: 0 },
  { id: '2', titulo: 'Auxiliar Administrativo', area: 'Administrativo', candidatos: 0 },
  { id: '4', titulo: 'Desenvolvedor Front-end', area: 'Tecnologia da Informação', candidatos: 0 },
  { id: '5', titulo: 'Assistente de Marketing', area: 'Marketing', candidatos: 0 },
  { id: '6', titulo: 'Jovem Aprendiz - Auxiliar', area: 'Administrativo', candidatos: 4 },
];
 
const matriculasEnviadas: MatriculaEnviada[] = [
  {
    id: '1',
    nome: 'Ana Beatriz Souza',
    curso: 'Curso Técnico em Informática',
    area: 'Tecnologia da Informação',
  },
  {
    id: '2',
    nome: 'Mariana Costa',
    curso: 'Curso de Língua Inglesa',
    area: 'Idiomas',
  },
  {
    id: '3',
    nome: 'Lucas Ferreira',
    curso: 'Curso de Língua Espanhola',
    area: 'Idiomas',
  },
];
 
const areas = ['Todos', 'Tecnologia da Informação', 'Marketing', 'Administrativo'];
const areasMatriculas = [...areas, 'Idiomas'];
const categoriasEnvio = ['Currículos', 'Matrículas'] as const;
 
/* ---------- tela ---------- */
export default function Inicio() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('Todos');
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [posicaoMenu, setPosicaoMenu] = useState({ top: 0, left: 0 });
  const seletorRef = useRef<View>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<(typeof categoriasEnvio)[number]>('Currículos');
  const areasDisponiveis =
    categoriaSelecionada === 'Matrículas' ? areasMatriculas : areas;
 
  const alternarCategorias = () => {
    if (mostrarCategorias) {
      setMostrarCategorias(false);
      return;
    }
 
    seletorRef.current?.measureInWindow((x, y, width) => {
      setPosicaoMenu({ top: y + 42, left: Math.max(8, x + width - 140) });
      setMostrarCategorias(true);
    });
  };
 
  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (categoriaSelecionada === 'Matrículas') {
      const porCurso = new Map<string, MatriculaEnviada[]>();
      matriculasEnviadas
        .filter((matricula) =>
          areaSelecionada === 'Todos' || matricula.area === areaSelecionada
        )
        .forEach((matricula) => {
          const alunos = porCurso.get(matricula.curso) ?? [];
          alunos.push(matricula);
          porCurso.set(matricula.curso, alunos);
        });

      const cursos: CursoComMatriculas[] = Array.from(porCurso.entries())
        .map(([curso, alunos]) => ({
          tipo: 'matricula',
          id: curso,
          curso,
          area: alunos[0].area,
          alunos,
        }));

      return cursos.filter((item) =>
          termo === '' ||
          item.curso.toLowerCase().includes(termo) ||
          item.area.toLowerCase().includes(termo) ||
          item.alunos.some((aluno) => aluno.nome.toLowerCase().includes(termo))
        );
    }
 
    return vagas
      .filter((vaga) => {
        const bateArea = areaSelecionada === 'Todos' || vaga.area === areaSelecionada;
        const bateBusca =
          termo === '' ||
          vaga.titulo.toLowerCase().includes(termo) ||
          vaga.area.toLowerCase().includes(termo);
        return bateArea && bateBusca;
      })
      .map((vaga): ItemEnvio => ({ ...vaga, tipo: 'curriculo' }));
  }, [busca, areaSelecionada, categoriaSelecionada]);
 
  const abrirVaga = (item: ItemEnvio) => {
    if (item.tipo !== 'curriculo') return;
 
    if (item.id === '6') {
      router.push('/analisarcurri');
    } else {
      router.push(`/rotas/vagas/${item.id}`);
    }
  };
  const cabecalho = (
    <View style={styles.cabecalhoLista}>
      {/* título */}
      <View style={styles.saudacao}>
        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          Consulte os <Text style={styles.destaque}>currículos e matrículas</Text> enviados pelos
          candidatos.
        </Text>
      </View>
 
      {/* busca */}
      <View style={styles.busca}>
        <Ionicons name="search-outline" size={22} color={cores.texto} />
        <TextInput
          style={styles.buscaInput}
          placeholder={
            categoriaSelecionada === 'Currículos'
              ? 'Buscar vaga ou área...'
              : 'Buscar curso ou pessoa...'
          }
          placeholderTextColor={cores.texto}
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
        />
        <View ref={seletorRef} style={styles.seletorContainer}>
          <Pressable
            style={styles.seletorBotao}
            onPress={alternarCategorias}
            accessibilityRole="button"
            accessibilityState={{ expanded: mostrarCategorias }}
            accessibilityLabel={`Tipo de envio: ${categoriaSelecionada}`}
          >
            <Image
              source={require('../../assets/images/filtro.png')}
              style={styles.iconeFiltro}
              resizeMode="contain"
              accessibilityLabel="Filtro"
            />
          </Pressable>
 
        </View>
      </View>
 
      <FlatList
        data={areasDisponiveis}
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
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
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
      <Header />
 
      {/* área roxa */}
      <View style={styles.fundoRoxo}>
        <View pointerEvents="none" style={styles.circuloGrande} />
        {cabecalho}
 
        <FlatList
          style={styles.lista}
          data={listaFiltrada}
          keyExtractor={(item) => `${item.tipo}-${item.id}`}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {categoriaSelecionada === 'Currículos'
                ? 'Nenhuma vaga encontrada.'
                : 'Nenhum curso com matrículas encontrado.'}
            </Text>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={item.tipo === 'curriculo' ? () => abrirVaga(item) : undefined}
              disabled={item.tipo === 'matricula'}
            >
              <View style={styles.avatar}>
                <Image
                  source={require('../../assets/images/envelope.png')}
                  style={styles.envelope}
                  resizeMode="contain"
                />
              </View>
 
              <View style={styles.info}>
                <Text style={styles.nome}>
                  {item.tipo === 'curriculo' ? item.titulo : item.curso}
                </Text>
                <Text style={styles.cargo}>
                  {item.tipo === 'matricula'
                    ? `${item.alunos.length} ${item.alunos.length === 1 ? 'matriculado' : 'matriculados'} · ${item.area}`
                    : `${item.candidatos} ${item.candidatos === 1 ? 'candidato' : 'candidatos'} · ${item.area}`}
                </Text>
              </View>
 
              <Ionicons name="chevron-forward" size={20} color={cores.preto} />
            </Pressable>
          )}
        />
      </View>
 
      <RodapeFlutuante
        abaAtiva="inicio"
        aoIrParaInicio={() => router.push('/(tabs)/curriculo')}
        aoAdicionar={() => router.push('/(tabs)/rotas/produtos/editaremprego')}
        aoIrParaPerfil={() => router.push('/(tabs)/perfilempresa')}
      />
 
      <Modal
        transparent
        visible={mostrarCategorias}
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setMostrarCategorias(false)}
      >
        <View style={styles.modalCategorias}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMostrarCategorias(false)}
            accessibilityRole="button"
            accessibilityLabel="Fechar opções do filtro"
          />
          <View style={[styles.opcoesSeletor, posicaoMenu]}>
            {categoriasEnvio.map((categoria, index) => (
              <Pressable
                key={categoria}
                style={[
                  styles.opcaoSeletor,
                  categoria === categoriaSelecionada && styles.opcaoSeletorAtiva,
                  categoria === 'Matrículas' &&
                    categoria === categoriaSelecionada &&
                    styles.opcaoSeletorInferiorArredondada,
                  index < categoriasEnvio.length - 1 && styles.opcaoSeletorDivisoria,
                ]}
                onPress={() => {
                  setCategoriaSelecionada(categoria);
                  setAreaSelecionada('Todos');
                  setMostrarCategorias(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: categoria === categoriaSelecionada }}
              >
                <Text
                  style={[
                    styles.opcaoSeletorTexto,
                    categoria === categoriaSelecionada && styles.opcaoSeletorTextoAtivo,
                  ]}
                >
                  {categoria}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
 
/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco },
 
  fundoRoxo: { flex: 1, backgroundColor: cores.roxo, overflow: 'hidden' },
  circuloGrande: {
    position: 'absolute',
    top: 150,
    right: -105,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
 
  saudacao: { paddingHorizontal: 20, paddingTop: 20, gap: 8 },
  titulo: { fontSize: 32, fontWeight: '800', color: cores.branco, lineHeight: 38 },
  subtitulo: { fontSize: 16, color: cores.branco, lineHeight: 23 },
  destaque: { color: cores.amarelo, fontWeight: '700' },
 
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.branco,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
    marginHorizontal: 20,
    marginTop: 20,
    zIndex: 30,
    elevation: 30,
  },
  buscaInput: { flex: 1, fontSize: 15, color: cores.titulo },
 
  chips: { paddingHorizontal: 20, gap: 8, paddingTop: 16 },
  cabecalhoLista: {
    position: 'relative',
    zIndex: 30,
    elevation: 30,
  },
  lista: {
    flex: 1,
    zIndex: 0,
  },
  seletorContainer: {
    position: 'relative',
    zIndex: 40,
    elevation: 40,
  },
  iconeFiltro: { width: 20, height: 20 },
  seletorBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 52,
    borderLeftWidth: 1,
    borderLeftColor: cores.cinzaClaro,
  },
  opcoesSeletor: {
    position: 'absolute',
    width: 140,
    borderRadius: 12,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: '#D9D2E8',
    shadowColor: cores.preto,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  modalCategorias: {
    flex: 1,
  },
  opcaoSeletor: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 40,
    justifyContent: 'center',
  },
  opcaoSeletorAtiva: {
    backgroundColor: '#F3EBFF',
  },
  opcaoSeletorInferiorArredondada: {
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
  },
  opcaoSeletorDivisoria: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E0EF',
  },
  opcaoSeletorTexto: {
    color: cores.titulo,
    fontSize: 14,
  },
  opcaoSeletorTextoAtivo: {
    color: cores.roxo,
    fontWeight: '800',
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: cores.vidro,
  },
  chipAtivo: { backgroundColor: cores.amarelo },
  chipTexto: { fontSize: 14, color: cores.branco, fontWeight: '600' },
  chipTextoAtivo: { color: cores.titulo, fontWeight: '800' },
 
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
  envelope: { width: 26, height: 26 },
  info: { flex: 1, gap: 2 },
  nome: { fontSize: 16, fontWeight: '800', color: cores.titulo },
  cargo: { fontSize: 14, color: cores.texto },
 
  vazio: { textAlign: 'center', color: cores.branco, padding: 32 },
 
});
 