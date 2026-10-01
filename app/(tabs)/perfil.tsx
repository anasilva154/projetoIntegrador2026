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

/* ------------------------------------------------------------------
   CORES (as mesmas da tela de cadastro)
------------------------------------------------------------------ */
const ROXO = '#7B2CFF';
const AMARELO = '#FFC700';
const CINZA_CARD = '#EBEBEB';
const CINZA_INPUT = '#F8F8F8';
const TEXTO = '#333333';

/* ------------------------------------------------------------------
   OPÇÕES QUE O USUÁRIO PODE ESCOLHER
------------------------------------------------------------------ */
const ESCOLARIDADES = [
  'Fundamental incompleto',
  'Fundamental completo',
  'Médio incompleto',
  'Médio completo',
  'Superior incompleto',
  'Superior completo',
];

const CARGOS = [
  'Atendente',
  'Auxiliar administrativo',
  'Caixa',
  'Cozinheiro',
  'Estoquista',
  'Motorista',
  'Porteiro',
  'Recepcionista',
  'Vendedor',
  'Auxiliar de limpeza',
];

/* ------------------------------------------------------------------
   TIPOS
------------------------------------------------------------------ */
type Perfil = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  escolaridade: string;
  cargos: string[]; // é por este array que a empresa vai filtrar
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

type ItemChip = {
  id: string;
  ativo: boolean;
};

/* ------------------------------------------------------------------
   COMPONENTES REUTILIZÁVEIS
   (depois você pode mover cada um para a pasta components/)
------------------------------------------------------------------ */

// Header: voltar + título + lápis (vira X quando está editando)
type HeaderProps = {
  titulo: string;
  editando: boolean;
  onVoltar: () => void;
  onEditar: () => void;
};

function Header({ titulo, editando, onVoltar, onEditar }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerEsquerda}>
        <Pressable onPress={onVoltar}>
          <Ionicons name="arrow-back" size={24} color={AMARELO} />
        </Pressable>
        <Text style={styles.headerTitulo}>{titulo}</Text>
      </View>

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
      <Ionicons name="person" size={52} color={ROXO} />

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
};

function Campo({
  icone,
  rotulo,
  valor,
  teclado,
  editando,
  onChangeText,
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
    </View>
  );
}

// Linha fina entre os itens
function Divisor() {
  return <View style={styles.divisor} />;
}

// Bolinha selecionável (usada em escolaridade e cargos)
type ChipProps = {
  texto: string;
  ativo: boolean;
  onPress?: () => void;
};

function Chip({ texto, ativo, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>
        {texto}
      </Text>
    </Pressable>
  );
}

// Seção com título e conteúdo dentro (usa children)
type SecaoProps = {
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
};

function Secao({ titulo, icone, children }: SecaoProps) {
  return (
    <View style={styles.secao}>
      <View style={styles.secaoTitulo}>
        <Ionicons name={icone} size={22} color={ROXO} />
        <Text style={styles.rotulo}>{titulo}</Text>
      </View>
      {children}
    </View>
  );
}

// Lista horizontal de chips.
// Visualizando: mostra só os escolhidos. Editando: mostra todas as opções.
type ListaChipsProps = {
  opcoes: string[];
  selecionados: string[];
  editando: boolean;
  vazio: string;
  onToggle: (opcao: string) => void;
};

function ListaChips({
  opcoes,
  selecionados,
  editando,
  vazio,
  onToggle,
}: ListaChipsProps) {
  const dados: ItemChip[] = (editando ? opcoes : selecionados).map(
    (texto) => ({ id: texto, ativo: selecionados.includes(texto) })
  );

  return (
    <FlatList
      data={dados}
      keyExtractor={(item) => item.id}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Chip
          texto={item.id}
          ativo={item.ativo}
          onPress={editando ? () => onToggle(item.id) : undefined}
        />
      )}
      ListEmptyComponent={<Text style={styles.vazio}>{vazio}</Text>}
    />
  );
}

/* ------------------------------------------------------------------
   TELA DE PERFIL
------------------------------------------------------------------ */
export default function PerfilScreen() {
  const router = useRouter();

  // perfil = dados salvos | rascunho = o que está sendo editado
  const [perfil, setPerfil] = useState<Perfil>({
    nome: 'Maria Souza Lima',
    cpf: '123.456.789-00',
    telefone: '(48) 99999-0000',
    email: 'maria.lima@voou.com',
    escolaridade: 'Médio completo',
    cargos: ['Atendente', 'Recepcionista'],
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
    // aqui você enviaria rascunho.cargos e o resto para a API
  };

  const atualizarTexto = (chave: ChaveTexto, texto: string) => {
    setRascunho((r) => ({ ...r, [chave]: texto }));
  };

  const escolherEscolaridade = (opcao: string) => {
    setRascunho((r) => ({ ...r, escolaridade: opcao }));
  };

  // Marca ou desmarca um cargo
  const alternarCargo = (cargo: string) => {
    setRascunho((r) => ({
      ...r,
      cargos: r.cargos.includes(cargo)
        ? r.cargos.filter((c) => c !== cargo)
        : [...r.cargos, cargo],
    }));
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
    />
  );

  /* ---------- topo da lista ---------- */
  const Topo = (
    <View style={styles.topo}>
      <Avatar editando={editando} />

      <Text style={styles.nome}>{atual.nome}</Text>

      <View style={styles.selo}>
        <Ionicons name="search" size={14} color={ROXO} />
        <Text style={styles.seloTexto}>Procurando emprego</Text>
      </View>

      {!editando && (
        <Pressable
          style={styles.botaoOlho}
          onPress={() => setMostrarCpf((valorAtual) => !valorAtual)}
        >
          <Ionicons
            name={mostrarCpf ? 'eye-off' : 'eye'}
            size={18}
            color={ROXO}
          />
          <Text style={styles.botaoOlhoTexto}>
            {mostrarCpf ? 'Ocultar CPF' : 'Mostrar CPF'}
          </Text>
        </Pressable>
      )}
    </View>
  );

  /* ---------- rodapé da lista ---------- */
  const Rodape = (
    <View>
      <Divisor />

      <Secao titulo="Nível de escolaridade" icone="school">
        <ListaChips
          opcoes={ESCOLARIDADES}
          selecionados={atual.escolaridade ? [atual.escolaridade] : []}
          editando={editando}
          vazio="Nenhum nível informado"
          onToggle={escolherEscolaridade}
        />
      </Secao>

      <Divisor />

      <Secao titulo="Cargos que procuro" icone="briefcase">
        <ListaChips
          opcoes={CARGOS}
          selecionados={atual.cargos}
          editando={editando}
          vazio="Nenhum cargo selecionado"
          onToggle={alternarCargo}
        />
      </Secao>

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
      <Header
        titulo="Meu Perfil"
        editando={editando}
        onVoltar={() => router.back()}
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
          keyboardShouldPersistTaps="handled" // toca nos chips com o teclado aberto
        />
      </View>
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
    backgroundColor: ROXO,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    marginBottom: 30,
  },

  // Topo
  topo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AMARELO,
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
    backgroundColor: ROXO,
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
    backgroundColor: '#E3D3FF',
  },
  seloTexto: {
    color: ROXO,
    fontSize: 13,
    fontWeight: '600',
  },
  botaoOlho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: CINZA_INPUT,
  },
  botaoOlhoTexto: {
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

  // Seções com chips
  secao: {
    paddingVertical: 14,
  },
  secaoTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: CINZA_INPUT,
    borderWidth: 1,
    borderColor: '#D6D6D6',
  },
  chipAtivo: {
    backgroundColor: ROXO,
    borderColor: ROXO,
  },
  chipTexto: {
    color: TEXTO,
    fontSize: 14,
  },
  chipTextoAtivo: {
    color: '#fff',
    fontWeight: '600',
  },
  vazio: {
    color: '#999',
    fontSize: 14,
  },

  // Botões (mesmo estilo do botão "Cadastrar")
  botaoAmarelo: {
    backgroundColor: AMARELO,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
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