import AsyncStorage from '@react-native-async-storage/async-storage';
import { DadosVagas } from './dados';

const CHAVE_VAGAS = '@vooa/vagas';

export type VagaItem = {
  id: string;
  titulo: string;
  empresa: string;
  categoria: string;
  cidade: string;
  quantidade: number;
  presencial: boolean;
  sobre: string;
  cargaHoraria: string;
  salario: string;
  idade: string;
  escolaridade: string;
  requisitos: string;
  beneficios: string;
  topicos: { descricao: string }[];
};

// Converte um texto em lista de tópicos para exibição nos cartões
function gerarTopicos(sobre: string): { descricao: string }[] {
  const linhas = sobre
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (linhas.length === 0) {
    return [{ descricao: 'Atividades conforme orientação da empresa.' }];
  }

  return linhas.map((descricao) => ({ descricao }));
}

// 1. Inicializa o AsyncStorage a partir da base estática (dados.tsx)
export async function inicializarVagas(): Promise<VagaItem[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_VAGAS);

  if (salvo) {
    return JSON.parse(salvo) as VagaItem[];
  }

  const baseEstatica = DadosVagas();
  const vagasIniciais: VagaItem[] = baseEstatica.map((item) => ({
    id: String(item.id),
    titulo: item.titulo,
    empresa: item.empresa || 'Empresa Parceira',
    categoria: item.categoria || 'Geral',
    cidade: 'Criciúma - SC',
    quantidade: 1,
    presencial: true,
    sobre: item.topicos
      .map((t) => t.descricao.replace(/^\s*-\s*/, ''))
      .join('\n'),
    cargaHoraria: item.cargaHoraria || 'A combinar',
    salario: item.salario || 'A combinar',
    idade: item.idade || 'A partir de 16 anos',
    escolaridade: item.escolaridade || 'Ensino médio',
    requisitos: item.requisitos || 'Não informado',
    beneficios: item.beneficios || 'Vale transporte',
    topicos: item.topicos,
  }));

  await AsyncStorage.setItem(CHAVE_VAGAS, JSON.stringify(vagasIniciais));
  return vagasIniciais;
}

// 2. Lista todas as vagas salvas no cache local
export async function listarVagas(): Promise<VagaItem[]> {
  return await inicializarVagas();
}

// 3. Busca uma vaga específica pelo ID
export async function buscarVagaPorId(id?: string): Promise<VagaItem | null> {
  const vagas = await listarVagas();
  if (!id) return vagas[0] || null;
  return vagas.find((v) => String(v.id) === String(id)) || vagas[0] || null;
}

// 4. Cadastra uma nova vaga no AsyncStorage
export async function adicionarVaga(
  dados: Omit<VagaItem, 'id' | 'topicos'>
): Promise<VagaItem> {
  const vagas = await listarVagas();

  const novaVaga: VagaItem = {
    ...dados,
    id: String(Date.now()),
    topicos: gerarTopicos(dados.sobre),
  };

  // Coloca a nova vaga no início da lista para aparecer primeiro
  const novaLista = [novaVaga, ...vagas];
  await AsyncStorage.setItem(CHAVE_VAGAS, JSON.stringify(novaLista));
  return novaVaga;
}

// 5. Atualiza uma vaga existente no AsyncStorage
export async function editarVaga(
  id: string,
  dados: Partial<Omit<VagaItem, 'id' | 'topicos'>>
): Promise<VagaItem[]> {
  const vagas = await listarVagas();

  const novaLista = vagas.map((vaga) => {
    if (String(vaga.id) !== String(id)) return vaga;

    const sobreAtualizado =
      dados.sobre !== undefined ? dados.sobre : vaga.sobre;

    return {
      ...vaga,
      ...dados,
      topicos: gerarTopicos(sobreAtualizado),
    };
  });

  await AsyncStorage.setItem(CHAVE_VAGAS, JSON.stringify(novaLista));
  return novaLista;
}

// 6. Remove uma vaga do AsyncStorage
export async function removerVaga(id: string): Promise<VagaItem[]> {
  const vagas = await listarVagas();
  const novaLista = vagas.filter((vaga) => String(vaga.id) !== String(id));
  await AsyncStorage.setItem(CHAVE_VAGAS, JSON.stringify(novaLista));
  return novaLista;
}

export default function VagasControllerRota() {
  return null;
}

