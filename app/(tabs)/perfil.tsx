import { ContainerAnimado } from '../../components/entradaAnimada';
// app/(tabs)/perfil.tsx
import { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RodapeFlutuante } from '../../components/rodapeperfil';
import { Header as HeaderLogo } from '../../components/header';
import {
  atualizarUsuarioLogado,
  logoutUsuario,
  obterUsuarioLogado,
  useProtegerRota,
} from '../rotaServidor/usuarioController';

/* ------------------------------------------------------------------
   CORES (as mesmas da tela de cadastro)
------------------------------------------------------------------ */
const ROXO = '#7B2FF7';
const ROXO_FUNDO = '#7B2FF7';
const AMARELO = '#FFC700';
const CINZA_CARD = '#EBEBEB';
const CINZA_INPUT = '#F8F8F8';
const TEXTO = '#333333';

/* ------------------------------------------------------------------
   TIPOS
------------------------------------------------------------------ */
type Perfil = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

type ChaveTexto = 'nome' | 'cpf' | 'telefone' | 'email';

type ItemCampo = {
  id: string;
  chave: ChaveTexto;
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  valor: string;
  teclado: KeyboardTypeOptions;
};

type HeaderProps = {
  titulo: string;
  editando: boolean;
  onEditar: () => void;
};

function Header({ titulo, editando, onEditar }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitulo}>{titulo}</Text>

      <Pressable onPress={onEditar}>
        <Ionicons
          name={editando ? 'close' : 'pencil'}
          size={24}
          color={AMARELO}
        />
      </Pressable>
    </View>
  );
}

type AvatarProps = {
  editando: boolean;
};

function Avatar({ editando }: AvatarProps) {
  return (
    <View style={styles.avatar}>
      <Ionicons name="person" size={52} color="#808080" />

      {editando && (
        <View style={styles.avatarCamera}>
          <Ionicons name="camera" size={16} color="#fff" />
        </View>
      )}
    </View>
  );
}

type CampoProps = {
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  valor: string;
  teclado: KeyboardTypeOptions;
  editando: boolean;
  onChangeText: (texto: string) => void;
  mostrarCpf: boolean;
  onToggleCpf: () => void;
};

function Campo({
  icone,
  rotulo,
  valor,
  teclado,
  editando,
  onChangeText,
  mostrarCpf,
  onToggleCpf,
}: CampoProps) {
  return (
    <View style={styles.campo}>
      <Ionicons name={icone} size={22} color={ROXO} />
      <View style={styles.campoTextos}>
        <Text style={styles.rotulo}>{rotulo}</Text>

        {editando ? (
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={onChangeText}
            keyboardType={teclado}
            autoCapitalize="none"
          />
        ) : (
          <Text style={styles.valor}>{valor || 'Não informado'}</Text>
        )}
      </View>
      {rotulo === 'CPF' && !editando && (
        <Pressable
          onPress={onToggleCpf}
          accessibilityRole="button"
          accessibilityLabel={mostrarCpf ? 'Ocultar CPF' : 'Mostrar CPF'}
          hitSlop={10}
        >
          <Ionicons
            name={mostrarCpf ? 'eye-off' : 'eye'}
            size={20}
            color={ROXO}
          />
        </Pressable>
      )}
    </View>
  );
}

function Divisor() {
  return <View style={styles.divisor} />;
}

/* ------------------------------------------------------------------
   TELA DE PERFIL (PESSOA FÍSICA / CLIENTE)
------------------------------------------------------------------ */
export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, setUsuario } = useProtegerRota('cliente');

  const [perfil, setPerfil] = useState<Perfil>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });
  const [rascunho, setRascunho] = useState<Perfil>(perfil);
  const [editando, setEditando] = useState(false);
  const [mostrarCpf, setMostrarCpf] = useState(false);

  // Carrega os dados do usuário logado na tela
  useEffect(() => {
    if (!usuario) return;

    const dadosUsuario: Perfil = {
      nome: usuario.nome || '',
      cpf: usuario.cpf || '',
      telefone: usuario.telefone || '',
      email: usuario.email || '',
    };
    obterUsuarioLogado().then((logado) => {
      if (!logado) return;
      setPerfil(dadosUsuario);
      setRascunho(dadosUsuario);
  
    });

  }, [usuario]);

  if (!usuario) return null;

  const atual = editando ? rascunho : perfil;

  /* ---------- ações ---------- */
  const iniciarEdicao = () => {
    setRascunho(perfil);
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setEditando(false);
  };

  const salvar = async () => {
    try {
      const atualizado = await atualizarUsuarioLogado({
        nome: rascunho.nome,
        cpf: rascunho.cpf,
        telefone: rascunho.telefone,
        email: rascunho.email,
      });
      setUsuario(atualizado);
      setPerfil(rascunho);
      setEditando(false);
      Alert.alert('Sucesso', 'Seus dados foram atualizados!');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const sair = async () => {
    await logoutUsuario();
    router.replace('/');
  };

  const atualizarTexto = (chave: ChaveTexto, texto: string) => {
    setRascunho((r) => ({ ...r, [chave]: texto }));
  };

  const cpfMascarado = '•••.•••.•••-••';

  const dados: ItemCampo[] = [
    {
      id: '1',
      chave: 'nome',
      icone: 'person',
      rotulo: 'Nome completo',
      valor: atual.nome,
      teclado: 'default',
    },
    {
      id: '2',
      chave: 'cpf',
      icone: 'card',
      rotulo: 'CPF',
      valor: editando || mostrarCpf ? atual.cpf : cpfMascarado,
      teclado: 'numeric',
    },
    {
      id: '3',
      chave: 'telefone',
      icone: 'call',
      rotulo: 'Telefone',
      valor: atual.telefone,
      teclado: 'phone-pad',
    },
    {
      id: '4',
      chave: 'email',
      icone: 'mail',
      rotulo: 'E-mail',
      valor: atual.email,
      teclado: 'email-address',
    },
  ];

  const renderItem = ({ item }: { item: ItemCampo }) => (
    <Campo
      icone={item.icone}
      rotulo={item.rotulo}
      valor={item.valor}
      teclado={item.teclado}
      editando={editando}
      onChangeText={(texto) => atualizarTexto(item.chave, texto)}
      mostrarCpf={mostrarCpf}
      onToggleCpf={() => setMostrarCpf((valorAtual) => !valorAtual)}
    />
  );

  const Topo = (
    <View style={styles.topo}>
      <Avatar editando={editando} />
      <Text style={styles.nome}>{atual.nome}</Text>
    </View>
  );

  const Rodape = (
    <View>
      <Divisor />

      {editando ? (
        <View>
          <Pressable style={styles.botaoAmarelo} onPress={salvar}>
            <Text style={styles.botaoAmareloTexto}>Salvar</Text>
          </Pressable>

          <Pressable style={styles.botaoCancelar} onPress={cancelarEdicao}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.botaoAmarelo} onPress={sair}>
          <Text style={styles.botaoAmareloTexto}>Sair</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderLogo />

      <View style={styles.conteudo}>
        <Header
          titulo="Meu Perfil"
          editando={editando}
          onEditar={editando ? cancelarEdicao : iniciarEdicao}
        />

        <ContainerAnimado style={styles.card}>
          <FlatList
            data={dados}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={Topo}
            ListFooterComponent={Rodape}
            ItemSeparatorComponent={Divisor}
            keyboardShouldPersistTaps="handled"
          />
        </ContainerAnimado>
      </View>

      <RodapeFlutuante
        abaAtiva="perfil"
        aoIrParaInicio={() => router.push('/rotas/inicialpessoa')}
        aoAdicionar={() => router.push('/curriculos')}
        aoIrParaPerfil={() => router.push('/perfil')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROXO_FUNDO,
  },
  conteudo: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitulo: {
    color: AMARELO,
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    maxHeight: '70%',
    backgroundColor: CINZA_CARD,
    borderRadius: 24,
    padding: 20,
    marginBottom: 60,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarCamera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AMARELO,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: CINZA_CARD,
  },
  nome: {
    color: TEXTO,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  campoTextos: {
    flex: 1,
  },
  rotulo: {
    color: '#777',
    fontSize: 12,
  },
  valor: {
    color: TEXTO,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: CINZA_INPUT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    fontSize: 16,
    color: TEXTO,
  },
  divisor: {
    height: 1,
    backgroundColor: '#D6D6D6',
  },
  botaoAmarelo: {
    backgroundColor: AMARELO,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoAmareloTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoCancelarTexto: {
    color: '#777',
    fontSize: 15,
    fontWeight: '600',
  },
});
