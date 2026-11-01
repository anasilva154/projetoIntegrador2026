import AsyncStorage from '@react-native-async-storage/async-storage';
import { DadosCursos } from './dadoscursos';

const CHAVE_CURSOS = '@vooa/cursos';

export type CursoItem = {
  id: string;
  titulo: string;
  empresa: string;
  categoria: string;
  cidade: string;
  quantidade: number;
  presencial: boolean;
  sobre: string;
  periodo: string;
  duracao: string;
  cargaHoraria: string;
  valor: string;
  idade: string;
  escolaridade: string;
  requisitos: string;
  beneficios: string;
  topicos: { descricao: string }[];
};

function gerarTopicosCurso(sobre: string): { descricao: string }[] {
  const linhas = sobre
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (linhas.length === 0) {
    return [{ descricao: 'Formação prática voltada para o mercado de trabalho.' }];
  }

  return linhas.map((descricao) => ({ descricao }));
}

// 1. Inicializa o AsyncStorage a partir da base estática de cursos (dadoscursos.tsx)
export async function inicializarCursos(): Promise<CursoItem[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_CURSOS);

  if (salvo) {
    return JSON.parse(salvo) as CursoItem[];
  }

  const baseEstatica = DadosCursos();
  const cursosIniciais: CursoItem[] = baseEstatica.map((item: any) => ({
    id: String(item.id),
    titulo: item.titulo,
    empresa: item.empresa || 'Instituição Parceira',
    categoria: item.categoria || 'Qualificação Profissional',
    cidade: 'Criciúma - SC',
    quantidade: 20,
    presencial: true,
    sobre: (item.topicos || [])
      .map((t: { descricao: string }) => t.descricao.replace(/^\s*-\s*/, ''))
      .join('\n'),
    periodo: 'Matutino / Vespertino / Noturno',
    duracao: item.cargaHoraria || '60 horas',
    cargaHoraria: item.cargaHoraria || '60 horas',
    valor: item.valor || item.salario || 'Gratuito',
    idade: item.idade || 'A partir de 14 anos',
    escolaridade: item.escolaridade || 'Livre',
    requisitos: item.requisitos || 'Nenhum requisito específico',
    beneficios: item.beneficios || 'Certificado de conclusão',
    topicos: item.topicos || [],
  }));

  await AsyncStorage.setItem(CHAVE_CURSOS, JSON.stringify(cursosIniciais));
  return cursosIniciais;
}

// 2. Lista todos os cursos salvos no AsyncStorage
export async function listarCursos(): Promise<CursoItem[]> {
  return await inicializarCursos();
}

// 3. Busca um curso específico pelo ID
export async function buscarCursoPorId(id?: string): Promise<CursoItem | null> {
  const cursos = await listarCursos();
  if (!id) return cursos[0] || null;
  return cursos.find((c) => String(c.id) === String(id)) || cursos[0] || null;
}

// 4. Cadastra um novo curso no AsyncStorage
export async function adicionarCurso(
  dados: Omit<CursoItem, 'id' | 'topicos'>
): Promise<CursoItem> {
  const cursos = await listarCursos();

  const novoCurso: CursoItem = {
    ...dados,
    id: String(Date.now()),
    topicos: gerarTopicosCurso(dados.sobre),
  };

  const novaLista = [novoCurso, ...cursos];
  await AsyncStorage.setItem(CHAVE_CURSOS, JSON.stringify(novaLista));
  return novoCurso;
}

// 5. Atualiza um curso existente no AsyncStorage
export async function editarCurso(
  id: string,
  dados: Partial<Omit<CursoItem, 'id' | 'topicos'>>
): Promise<CursoItem[]> {
  const cursos = await listarCursos();

  const novaLista = cursos.map((curso) => {
    if (String(curso.id) !== String(id)) return curso;

    const sobreAtualizado =
      dados.sobre !== undefined ? dados.sobre : curso.sobre;

    return {
      ...curso,
      ...dados,
      topicos: gerarTopicosCurso(sobreAtualizado),
    };
  });

  await AsyncStorage.setItem(CHAVE_CURSOS, JSON.stringify(novaLista));
  return novaLista;
}

// 6. Remove um curso do AsyncStorage
export async function removerCurso(id: string): Promise<CursoItem[]> {
  const cursos = await listarCursos();
  const novaLista = cursos.filter((curso) => String(curso.id) !== String(id));
  await AsyncStorage.setItem(CHAVE_CURSOS, JSON.stringify(novaLista));
  return novaLista;
}

export default function CursosControllerRota() {
  return null;
}

