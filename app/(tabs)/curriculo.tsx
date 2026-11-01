// app/(tabs)/curriculo.tsx
import { type ComponentRef, useEffect, useMemo, useRef, useState } from 'react';
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
import { useRouter, useIsFocused } from 'expo-router';

import { Header } from '../../components/header';
import { RodapeFlutuante } from '../../components/rodapeFlutuante';
import { listarEnvios, type Envio } from '../rotaServidor/envios';
import { useProtegerRota } from '../rotaServidor/usuarioController';

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

type CandidatoVaga = {
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

type MatriculaEnviada = {
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

type CursoComMatriculas = {
  tipo: 'matricula';
  id: string;
  curso: string;
  area: string;
  alunos: MatriculaEnviada[];
};

type VagaComCandidatos = {
  tipo: 'curriculo';
  id: string;
  titulo: string;
  area: string;
  candidatos: CandidatoVaga[];
};

type ItemEnvio = VagaComCandidatos | CursoComMatriculas;

const categoriasEnvio = ['Currículos', 'Matrículas'] as const;

export default function InicioEmpresa() {
  const router = useRouter();
  const { usuario } = useProtegerRota('empresa');
  const telaEmFoco = useIsFocused();

  const [envios, setEnvios] = useState<Envio[]>([]);
  const [busca, setBusca] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('Todos');
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [posicaoMenu, setPosicaoMenu] = useState({ top: 0, left: 0 });
  const seletorRef = useRef<ComponentRef<typeof View>>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<(typeof categoriasEnvio)[number]>('Currículos');

  useEffect(() => {
    if (!telaEmFoco || !usuario) return;

    async function carregar() {
      const lista = await listarEnvios();
      setEnvios(lista);
    }

    carregar();
  }, [telaEmFoco, usuario]);

  // Monta as áreas disponíveis dinamicamente com base nos envios salvos no AsyncStorage
  const areasDisponiveis = useMemo(() => {
    const tipoAlvo = categoriaSelecionada === 'Matrículas' ? 'curso' : 'vaga';
    const conjunto = new Set<string>(['Todos']);
    envios
      .filter((e) => e.tipo === tipoAlvo)
      .forEach((e) => {
        if (e.area && e.area.trim()) {
          conjunto.add(e.area.trim());
        }
      });
    return Array.from(conjunto);
  }, [envios, categoriaSelecionada]);

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

  const listaFiltrada = useMemo<ItemEnvio[]>(() => {
    const termo = busca.trim().toLowerCase();

    if (categoriaSelecionada === 'Matrículas') {
      const porCurso = new Map<string, MatriculaEnviada[]>();

      envios
        .filter((envio) => envio.tipo === 'curso')
        .filter(
          (envio) =>
            areaSelecionada === 'Todos' || (envio.area || 'Geral') === areaSelecionada
        )
        .forEach((envio) => {
          const itemMatricula: MatriculaEnviada = {
            id: String(envio.id),
            nome: envio.nome || 'Aluno',
            curso: envio.titulo,
            area: envio.area || 'Qualificação',
            nascimento: envio.nascimento || 'Não informado',
            cpf: envio.cpf || 'Não informado',
            email: envio.email || 'Não informado',
            telefone: envio.telefone || 'Não informado',
            escolaridade: envio.escolaridade || 'Não informada',
            turno: envio.turno || 'Não informado',
            documento: {
              nome: envio.arquivo_nome || 'Comprovante_Matricula.pdf',
              detalhe: 'Arquivo enviado pelo aplicativo',
              url: '',
            },
          };

          const alunos = porCurso.get(envio.titulo) ?? [];
          alunos.push(itemMatricula);
          porCurso.set(envio.titulo, alunos);
        });

      const cursos: CursoComMatriculas[] = Array.from(porCurso.entries()).map(
        ([curso, alunos]) => ({
          tipo: 'matricula',
          id: curso,
          curso,
          area: alunos[0].area,
          alunos,
        })
      );

      return cursos.filter(
        (item) =>
          termo === '' ||
          item.curso.toLowerCase().includes(termo) ||
          item.area.toLowerCase().includes(termo) ||
          item.alunos.some((aluno) => aluno.nome.toLowerCase().includes(termo))
      );
    }

    // Agrupa os currículos enviados por vaga
    const porVaga = new Map<
      string,
      { area: string; candidatos: CandidatoVaga[] }
    >();

    envios
      .filter((envio) => envio.tipo === 'vaga')
      .filter(
        (envio) =>
          areaSelecionada === 'Todos' || (envio.area || 'Geral') === areaSelecionada
      )
      .forEach((envio) => {
        const candidato: CandidatoVaga = {
          id: String(envio.id),
          nome: envio.nome || 'Candidato',
          email: envio.email || 'Não informado',
          telefone: envio.telefone || 'Não informado',
          idade: envio.idade || 'Não informada',
          bairro: envio.cidade || 'Não informado',
          curriculo: {
            nome: envio.arquivo_nome || 'Curriculo.pdf',
            detalhe: 'Arquivo enviado pelo candidato',
            url: '',
          },
        };

        const atual = porVaga.get(envio.titulo) ?? {
          area: envio.area || 'Geral',
          candidatos: [],
        };
        atual.candidatos.push(candidato);
        porVaga.set(envio.titulo, atual);
      });

    const vagasAgrupadas: VagaComCandidatos[] = Array.from(porVaga.entries()).map(
      ([titulo, info]) => ({
        tipo: 'curriculo',
        id: titulo,
        titulo,
        area: info.area,
        candidatos: info.candidatos,
      })
    );

    return vagasAgrupadas.filter(
      (vaga) =>
        termo === '' ||
        vaga.titulo.toLowerCase().includes(termo) ||
        vaga.area.toLowerCase().includes(termo) ||
        vaga.candidatos.some((c) => c.nome.toLowerCase().includes(termo))
    );
  }, [envios, busca, areaSelecionada, categoriaSelecionada]);

  if (!usuario) return null;

  const abrirVaga = (item: ItemEnvio) => {
    if (item.tipo === 'matricula') {
      router.push({
        pathname: '/analisarmatri',
        params: {
          curso: item.curso,
          area: item.area,
          matriculados: JSON.stringify(item.alunos),
        },
      });
      return;
    }

    router.push({
      pathname: '/analisarcurri',
      params: {
        vaga: item.titulo,
        area: item.area,
        candidatos: JSON.stringify(item.candidatos),
      },
    });
  };

  const cabecalho = (
    <View style={styles.cabecalhoLista}>
      <View style={styles.saudacao}>
        <Text style={styles.titulo}>Olá, {usuario.nome}!</Text>
        <Text style={styles.subtitulo}>
          Consulte os <Text style={styles.destaque}>currículos e matrículas</Text> enviados pelos
          candidatos.
        </Text>
      </View>

      <View style={styles.busca}>
        <Ionicons name="search-outline" size={22} color={cores.texto} />
        <TextInput
          style={styles.buscaInput}
          placeholder={
            categoriaSelecionada === 'Currículos'
              ? 'Buscar vaga ou candidato...'
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
                ? 'Nenhuma candidatura encontrada.'
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
              onPress={() => abrirVaga(item)}
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
                    : `${item.candidatos.length} ${item.candidatos.length === 1 ? 'candidato' : 'candidatos'} · ${item.area}`}
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
  titulo: { fontSize: 28, fontWeight: '800', color: cores.branco, lineHeight: 34 },
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
  cabecalhoLista: { position: 'relative', zIndex: 30, elevation: 30 },
  lista: { flex: 1, zIndex: 0 },
  seletorContainer: { position: 'relative', zIndex: 40, elevation: 40 },
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
  modalCategorias: { flex: 1 },
  opcaoSeletor: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 40,
    justifyContent: 'center',
  },
  opcaoSeletorAtiva: { backgroundColor: '#F3EBFF' },
  opcaoSeletorInferiorArredondada: {
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
  },
  opcaoSeletorDivisoria: { borderBottomWidth: 1, borderBottomColor: '#E6E0EF' },
  opcaoSeletorTexto: { color: cores.titulo, fontSize: 14 },
  opcaoSeletorTextoAtivo: { color: cores.roxo, fontWeight: '800' },
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
