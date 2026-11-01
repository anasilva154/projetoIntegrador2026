import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';
import { useRouter, useIsFocused } from 'expo-router';

import dadosIniciais from './dadosIniciais.json';

// Garante funcionamento do bcrypt no React Native (Android/iOS/Web)
bcrypt.setRandomFallback((tamanho: number) => {
  const bytes: number[] = [];
  for (let i = 0; i < tamanho; i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  return bytes;
});

// Chaves usadas para salvar no AsyncStorage
const CHAVE_USUARIOS = '@vooa/usuarios';
const CHAVE_SESSAO = '@vooa/usuario_logado';

export type TipoUsuario = 'cliente' | 'empresa';

export type Usuario = {
  id: string;
  tipo: TipoUsuario;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  endereco?: string;
  senhaHash: string;
};

// Dados salvos na sessão (sem expor o hash da senha)
export type UsuarioSessao = Omit<Usuario, 'senhaHash'>;

function removerSenha(usuario: Usuario): UsuarioSessao {
  const { senhaHash: _senha, ...dadosPublicos } = usuario;
  return dadosPublicos;
}

function apenasNumeros(texto: string): string {
  return texto.replace(/\D/g, '');
}

// 1. Inicializa o AsyncStorage com os usuários do arquivo dadosIniciais.json
export async function inicializarUsuarios(): Promise<Usuario[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_USUARIOS);

  if (salvo) {
    return JSON.parse(salvo) as Usuario[];
  }

  const iniciais = dadosIniciais.usuarios as Usuario[];
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(iniciais));
  return iniciais;
}

// 2. Lista todos os usuários salvos no AsyncStorage
export async function listarUsuarios(): Promise<Usuario[]> {
  return await inicializarUsuarios();
}

// 3. Cadastra um novo usuário Pessoa Física (cliente) com senha criptografada em bcrypt
export async function cadastrarCliente(dados: {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  telefone?: string;
}): Promise<UsuarioSessao> {
  const usuarios = await listarUsuarios();
  const emailFormatado = dados.email.trim().toLowerCase();
  const cpfNumeros = apenasNumeros(dados.cpf);

  const emailExiste = usuarios.some(
    (u) => u.email && u.email.toLowerCase() === emailFormatado
  );
  if (emailExiste) {
    throw new Error('Já existe uma conta cadastrada com este e-mail.');
  }

  const cpfExiste = usuarios.some(
    (u) => u.cpf && apenasNumeros(u.cpf) === cpfNumeros
  );
  if (cpfExiste) {
    throw new Error('Já existe um usuário cadastrado com este CPF.');
  }

  const senhaHash = bcrypt.hashSync(dados.senha, 10);

  const novoUsuario: Usuario = {
    id: String(Date.now()),
    tipo: 'cliente',
    nome: dados.nome.trim(),
    email: emailFormatado,
    cpf: dados.cpf.trim(),
    telefone: dados.telefone?.trim() || '',
    senhaHash,
  };

  const novaLista = [...usuarios, novoUsuario];
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novaLista));

  const sessao = removerSenha(novoUsuario);
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));

  return sessao;
}

// 4. Cadastra uma nova Empresa com senha criptografada em bcrypt
export async function cadastrarEmpresa(dados: {
  nome: string;
  email?: string;
  cnpj: string;
  senha: string;
  telefone?: string;
  endereco?: string;
}): Promise<UsuarioSessao> {
  const usuarios = await listarUsuarios();
  const emailFormatado = (dados.email || '').trim().toLowerCase();
  const cnpjNumeros = apenasNumeros(dados.cnpj);

  if (emailFormatado) {
    const emailExiste = usuarios.some(
      (u) => u.email && u.email.toLowerCase() === emailFormatado
    );
    if (emailExiste) {
      throw new Error('Já existe uma conta cadastrada com este e-mail.');
    }
  }

  const cnpjExiste = usuarios.some(
    (u) => u.cnpj && apenasNumeros(u.cnpj) === cnpjNumeros
  );
  if (cnpjExiste) {
    throw new Error('Já existe uma empresa cadastrada com este CNPJ.');
  }

  const senhaHash = bcrypt.hashSync(dados.senha, 10);

  const novaEmpresa: Usuario = {
    id: String(Date.now()),
    tipo: 'empresa',
    nome: dados.nome.trim(),
    email: emailFormatado,
    cnpj: dados.cnpj.trim(),
    telefone: dados.telefone?.trim() || '',
    endereco:
      dados.endereco?.trim() ||
      'Rua Exemplo, 123, próximo ao Senac, Criciúma - SC',
    senhaHash,
  };

  const novaLista = [...usuarios, novaEmpresa];
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novaLista));

  const sessao = removerSenha(novaEmpresa);
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));

  return sessao;
}

// 5. Realiza login de Pessoa Física (cliente) validando somente CPF e senha com bcrypt
export async function loginCliente(
  cpf: string,
  senha: string
): Promise<UsuarioSessao> {
  const usuarios = await listarUsuarios();
  const cpfNumeros = apenasNumeros(cpf);

  const usuario = usuarios.find(
    (u) => u.tipo === 'cliente' && apenasNumeros(u.cpf || '') === cpfNumeros
  );

  if (!usuario || !bcrypt.compareSync(senha, usuario.senhaHash)) {
    throw new Error(
      'CPF ou senha incorretos. Confira os dados e tente novamente.'
    );
  }

  const sessao = removerSenha(usuario);
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  return sessao;
}

// 6. Realiza login de Empresa validando somente CNPJ e senha com bcrypt
export async function loginEmpresa(
  cnpj: string,
  senha: string
): Promise<UsuarioSessao> {
  const usuarios = await listarUsuarios();
  const cnpjNumeros = apenasNumeros(cnpj);

  const empresa = usuarios.find(
    (u) =>
      u.tipo === 'empresa' &&
      apenasNumeros(u.cnpj || '') === cnpjNumeros
  );

  if (!empresa || !bcrypt.compareSync(senha, empresa.senhaHash)) {
    throw new Error(
      'CNPJ ou senha incorretos. Confira os dados e tente novamente.'
    );
  }

  const sessao = removerSenha(empresa);
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  return sessao;
}

// 7. Busca o usuário que está logado na sessão atual
export async function obterUsuarioLogado(): Promise<UsuarioSessao | null> {
  const salvo = await AsyncStorage.getItem(CHAVE_SESSAO);
  if (!salvo) return null;

  try {
    return JSON.parse(salvo) as UsuarioSessao;
  } catch {
    return null;
  }
}

// 8. Atualiza os dados do perfil do usuário logado no cache local
export async function atualizarUsuarioLogado(
  novosDados: Partial<Omit<Usuario, 'id' | 'tipo' | 'senhaHash'>>
): Promise<UsuarioSessao> {
  const sessaoAtual = await obterUsuarioLogado();
  if (!sessaoAtual) {
    throw new Error('Nenhum usuário logado.');
  }

  const usuarios = await listarUsuarios();
  let usuarioAtualizado: UsuarioSessao = sessaoAtual;

  const novaLista = usuarios.map((u) => {
    if (u.id === sessaoAtual.id) {
      const atualizado: Usuario = {
        ...u,
        ...novosDados,
        email: novosDados.email
          ? novosDados.email.trim().toLowerCase()
          : u.email,
      };
      usuarioAtualizado = removerSenha(atualizado);
      return atualizado;
    }
    return u;
  });

  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novaLista));
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuarioAtualizado));

  return usuarioAtualizado;
}

// 9. Verifica se um e-mail existe na base local (para recuperação de senha)
export async function verificarEmailCadastrado(email: string): Promise<boolean> {
  const usuarios = await listarUsuarios();
  const emailFormatado = email.trim().toLowerCase();
  return usuarios.some((u) => u.email.toLowerCase() === emailFormatado);
}

// 10. Encerra a sessão do usuário (Logout)
export async function logoutUsuario(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}

// 11. Hook simples para validar se o usuário logado é 'cliente' ou 'empresa' em cada tela
export function useProtegerRota(tipoPermitido: TipoUsuario) {
  const router = useRouter();
  const telaEmFoco = useIsFocused();
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!telaEmFoco) return;

    async function validarAcesso() {
      setCarregando(true);
      const logado = await obterUsuarioLogado();

      // Se não estiver logado, redireciona para a escolha de login
      if (!logado) {
        Alert.alert('Acesso restrito', 'Faça login para acessar esta página.');
        router.replace('/escolhaLogin');
        return;
      }

      // Se o tipo de usuário for diferente do permitido na tela, bloqueia o acesso
      if (logado.tipo !== tipoPermitido) {
        const areaPermitida =
          tipoPermitido === 'empresa' ? 'empresas' : 'candidatos (pessoa física)';
        Alert.alert(
          'Acesso negado',
          `Esta página é exclusiva para ${areaPermitida}.`
        );

        if (logado.tipo === 'empresa') {
          router.replace('/curriculo');
        } else {
          router.replace('/rotas/inicialpessoa');
        }
        return;
      }

      setUsuario(logado);
      setCarregando(false);
    }

    validarAcesso();
  }, [telaEmFoco, tipoPermitido, router]);

  return { usuario, setUsuario, carregando };
}

// Export default vazio apenas para o Expo Router não tratar este controller como tela
export default function UsuarioControllerRota() {
  return null;
}

