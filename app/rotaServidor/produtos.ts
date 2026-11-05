import AsyncStorage from '@react-native-async-storage/async-storage';

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
  imagemUrl: string;
  estoque: number;
};

const CHAVE_PRODUTOS = '@vooa/produtos';

function ehProduto(valor: unknown): valor is Produto {
  if (typeof valor !== 'object' || valor === null) return false;

  const produto = valor as Record<string, unknown>;
  return (
    typeof produto.id === 'string' &&
    typeof produto.nome === 'string' &&
    typeof produto.categoria === 'string' &&
    typeof produto.preco === 'number' &&
    typeof produto.descricao === 'string' &&
    typeof produto.imagemUrl === 'string' &&
    typeof produto.estoque === 'number'
  );
}

async function listarTodos(): Promise<Produto[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_PRODUTOS);
  if (!salvo) return [];

  const produtos: unknown = JSON.parse(salvo);
  if (!Array.isArray(produtos) || !produtos.every(ehProduto)) {
    throw new Error('Os produtos armazenados estão em formato inválido.');
  }

  return produtos;
}

async function criar(dados: Omit<Produto, 'id'>): Promise<Produto> {
  const produtos = await listarTodos();
  const produto: Produto = { ...dados, id: String(Date.now()) };
  await AsyncStorage.setItem(
    CHAVE_PRODUTOS,
    JSON.stringify([produto, ...produtos]),
  );
  return produto;
}

const produtosService = { listarTodos, criar };

export default produtosService;
