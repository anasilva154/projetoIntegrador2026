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
  mensagem?: string;
  nascimento?: string;
  cpf?: string;
  endereco?: string;
  escolaridade?: string;
  turno?: string;
  arquivo_nome?: string;
  arquivo_uri?: string;
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

export async function atualizarEnvioCandidatura(
  id: number,
  emailUsuario: string,
  dados: Pick<
    Envio,
    'nome' | 'email' | 'telefone' | 'idade' | 'cidade' | 'mensagem' | 'arquivo_nome' | 'arquivo_uri'
  >,
): Promise<Envio> {
  const envios = await listarEnvios();
  const indice = envios.findIndex((envio) => envio.id === id);

  if (indice === -1) {
    throw new Error('Este envio não foi encontrado.');
  }

  const envio = envios[indice];
  const emailFormatado = emailUsuario.trim().toLowerCase();
  const pertenceAoUsuario =
    envio.usuarioEmail?.trim().toLowerCase() === emailFormatado ||
    envio.email?.trim().toLowerCase() === emailFormatado;

  if (!pertenceAoUsuario) {
    throw new Error('Você não tem permissão para editar este envio.');
  }

  const envioAtualizado: Envio = {
    ...envio,
    ...dados,
    usuarioEmail: envio.usuarioEmail ?? emailUsuario,
  };
  const enviosAtualizados = [...envios];
  enviosAtualizados[indice] = envioAtualizado;

  await AsyncStorage.setItem(CHAVE_ENVIOS, JSON.stringify(enviosAtualizados));
  return envioAtualizado;
}

export async function excluirEnvioCandidatura(
  id: number,
  emailUsuario: string,
): Promise<void> {
  const envios = await listarEnvios();
  const envio = envios.find((item) => item.id === id);

  if (!envio || envio.tipo !== 'vaga') {
    throw new Error('Este currículo não foi encontrado.');
  }

  const emailFormatado = emailUsuario.trim().toLowerCase();
  const pertenceAoUsuario =
    envio.usuarioEmail?.trim().toLowerCase() === emailFormatado ||
    envio.email?.trim().toLowerCase() === emailFormatado;

  if (!pertenceAoUsuario) {
    throw new Error('Você não tem permissão para excluir este currículo.');
  }

  const enviosAtualizados = envios.filter((item) => item.id !== id);
  await AsyncStorage.setItem(CHAVE_ENVIOS, JSON.stringify(enviosAtualizados));
}

export default function EnviosControllerRota() {
  return null;
}
