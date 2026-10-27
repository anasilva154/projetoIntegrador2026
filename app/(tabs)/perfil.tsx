// app/(tabs)/perfil.tsx

import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RodapeFlutuante } from '../../components/rodapeperfil';
import { Header as HeaderLogo } from '../../components/header';

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
  id: string; // keyExtractor precisa de STRING
  chave: ChaveTexto;
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  valor: string;
  teclado: KeyboardTypeOptions;
};

/* ------------------------------------------------------------------
   COMPONENTES REUTILIZÁVEIS
   (depois você pode mover cada um para a pasta components/)
------------------------------------------------------------------ */

// Header: título + lápis (vira X quando está editando)
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

// Foto do perfil: por enquanto é só um ícone (sem função)
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

// Uma linha: ícone + rótulo + (texto ou campo de digitação)
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
          <Text style={styles.valor}>{valor}</Text>
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

// Linha fina entre os itens
function Divisor() {
  return <View style={styles.divisor} />;
}

/* ------------------------------------------------------------------
   TELA DE PERFIL
------------------------------------------------------------------ */
export default function PerfilScreen() {
  const router = useRouter();

  // perfil = dados salvos | rascunho = o que está sendo editado
  const [perfil, setPerfil] = useState<Perfil>({
    nome: 'nome da pessoa',
    cpf: '123.456.789-00',
    telefone: '(48) 99999-0000',
    email: 'email.pessoa@voou.com',
  });
  const [rascunho, setRascunho] = useState<Perfil>(perfil);
  const [editando, setEditando] = useState(false);
  const [mostrarCpf, setMostrarCpf] = useState(false);

  // Editando mostra o rascunho; senão mostra o perfil salvo
  const atual = editando ? rascunho : perfil;

  /* ---------- ações ---------- */
  const iniciarEdicao = () => {
    setRascunho(perfil); // começa a edição com uma cópia dos dados
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setEditando(false); // joga o rascunho fora
  };

  const salvar = () => {
    setPerfil(rascunho);
    setEditando(false);
  };

  const atualizarTexto = (chave: ChaveTexto, texto: string) => {
    setRascunho((r) => ({ ...r, [chave]: texto }));
  };

  /* ---------- data da FlatList ---------- */
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

  /* ---------- topo da lista ---------- */
  const Topo = (
    <View style={styles.topo}>
      <Avatar editando={editando} />

      <Text style={styles.nome}>{atual.nome}</Text>
    </View>
  );

  /* ---------- rodapé da lista ---------- */
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
        <Pressable
          style={styles.botaoAmarelo}
          onPress={() => router.replace('/')}
        >
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

        <View style={styles.card}>
          <FlatList
            data={dados}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={Topo}
            ListFooterComponent={Rodape}
            ItemSeparatorComponent={Divisor}
            keyboardShouldPersistTaps="handled"
          />
        </View>
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

/* ------------------------------------------------------------------
   ESTILOS
------------------------------------------------------------------ */
const styles = StyleSheet.create({
  // flex: 1 para a tela (e a lista) aparecerem
  container: {
    flex: 1,
    backgroundColor: ROXO_FUNDO,
  },
  conteudo: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
cabeçalho: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  
  // Header
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

  // Card cinza que guarda a lista
  card: {
    flex: 1,
    backgroundColor: CINZA_CARD,
    borderRadius: 24,
    padding: 20,
    marginBottom: 60,
  },

  // Topo do card 
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
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#7B2FF7',
  },
  seloTexto: {
    color: ROXO,
    fontSize: 13,
    fontWeight: '600',
  },
  // Campo
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

  // Divisor
  divisor: {
    height: 1,
    backgroundColor: '#D6D6D6',
  },

  // Botões (mesmo estilo do botão "Cadastrar")
  botaoAmarelo: {
    backgroundColor: AMARELO,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 38,
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