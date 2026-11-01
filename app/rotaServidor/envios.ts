import AsyncStorage from '@react-native-async-storage/async-storage';
import dadosIniciais from './dadosIniciais.json';

export type Envio = {
  id: number;
  tipo: 'vaga' | 'curso';
  titulo: string;
  empresa: string;
  area?: string;
  data_envio: string;
  status?: 'enviado' | 'visualizado' | 'aprovado' | 'recusado';
  nome?: string;
  email?: string;
  telefone?: string;
  idade?: string;
  cidade?: string;
  nascimento?: string;
  cpf?: string;
  endereco?: string;
  escolaridade?: string;
  turno?: string;
  arquivo_nome?: string;
  usuarioEmail?: string;
};

const CHAVE_ENVIOS = '@vooa/envios';

// Inicializa os envios a partir do dadosIniciais.json caso ainda não existam no AsyncStorage
export async function inicializarEnvios(): Promise<Envio[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_ENVIOS);

  if (salvo !== null) {
    try {
      const dados = JSON.parse(salvo);
      if (Array.isArray(dados)) {
        return dados as Envio[];
      }
    } catch {
      // Se houver erro de leitura, recarrega os dados iniciais
    }
  }

  const iniciais = (dadosIniciais.envios || []) as Envio[];
  await AsyncStorage.setItem(CHAVE_ENVIOS, JSON.stringify(iniciais));
  return iniciais;
}

export async function listarEnvios(): Promise<Envio[]> {
  return await inicializarEnvios();
}

export async function listarEnviosPorUsuario(email: string): Promise<Envio[]> {
  const todos = await listarEnvios();
  const emailFormatado = email.trim().toLowerCase();

  return todos.filter(
    (envio) =>
      envio.usuarioEmail?.toLowerCase() === emailFormatado ||
      envio.email?.toLowerCase() === emailFormatado
  );
}

export async function salvarEnvio(
  dados: Omit<Envio, 'id' | 'data_envio' | 'status'>
): Promise<Envio> {
  const envios = await listarEnvios();
  let id = Date.now();
  while (envios.some((envio) => envio.id === id)) {
    id += 1;
  }

  const novoEnvio: Envio = {
    ...dados,
    id,
    data_envio: new Date().toISOString(),
    status: 'enviado',
  };

  await AsyncStorage.setItem(
    CHAVE_ENVIOS,
    JSON.stringify([novoEnvio, ...envios])
  );

  return novoEnvio;
}

export default function EnviosControllerRota() {
  return null;
}
