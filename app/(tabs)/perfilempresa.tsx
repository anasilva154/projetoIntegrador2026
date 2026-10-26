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
  Linking,
  Alert,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RodapeFlutuante } from '../../components/rodapeFlutuante';

/* ------------------------------------------------------------------
   CORES (as mesmas da tela de cadastro)
------------------------------------------------------------------ */
const ROXO = '#7B2CFF';
const AMARELO = '#FFC700';
const CINZA_CARD = '#EBEBEB';
const CINZA_INPUT = '#F8F8F8';
const TEXTO = '#333333';
const LOCALIZACAO_EMPRESA =
  'Rua Exemplo, 123, próximo ao Senac, Criciúma - SC';

/* ------------------------------------------------------------------
   TIPOS
------------------------------------------------------------------ */
type Perfil = {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string; // é por este array que a empresa vai filtrar
};

type ChaveTexto = 'nome' | 'cnpj' | 'telefone' | 'email';

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
          color={ROXO}
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
  mostrarCnpj: boolean;
  onToggleCnpj: () => void;
};

function Campo({
  icone,
  rotulo,
  valor,
  teclado,
  editando,
  onChangeText,
  mostrarCnpj,
  onToggleCnpj,
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
      {rotulo === 'CNPJ' && !editando && (
        <Pressable
          onPress={onToggleCnpj}
          accessibilityRole="button"
          accessibilityLabel={mostrarCnpj ? 'Ocultar CNPJ' : 'Mostrar CNPJ'}
          hitSlop={10}
        >
          <Ionicons
            name={mostrarCnpj ? 'eye-off' : 'eye'}
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
    nome: 'nome da empresa',
    cnpj: '11.222.333/0001-81',
    telefone: '(48) 99999-0000',
    email: 'email.empresa@voou.com',
  });
  const [rascunho, setRascunho] = useState<Perfil>(perfil);
  const [editando, setEditando] = useState(false);
  const [mostrarCnpj, setMostrarCnpj] = useState(false);

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

  const abrirLocalizacao = async () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCALIZACAO_EMPRESA)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
    }
  };

  /* ---------- data da FlatList ---------- */
  const cnpjMascarado = '••.•••.•••/••••-••';

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
      chave: 'cnpj',
      icone: 'card',
      rotulo: 'CNPJ',
      valor: editando || mostrarCnpj ? atual.cnpj : cnpjMascarado,
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
      mostrarCnpj={mostrarCnpj}
      onToggleCnpj={() => setMostrarCnpj((valorAtual) => !valorAtual)}
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

      <Pressable
        style={styles.localizacao}
        onPress={abrirLocalizacao}
        accessibilityRole="link"
        accessibilityLabel={`Abrir localização: ${LOCALIZACAO_EMPRESA} no Google Maps`}
      >
        <Ionicons name="location" size={22} color={ROXO} />
        <View style={styles.localizacaoTextos}>
          <Text style={styles.rotulo}>Localização</Text>
          <Text style={styles.valor}>{LOCALIZACAO_EMPRESA}</Text>
        </View>
        <Ionicons name="open-outline" size={18} color={ROXO} />
      </Pressable>

      {editando ? (
        <View>
          <Pressable style={styles.botaoRoxo} onPress={salvar}>
            <Text style={styles.botaoRoxoTexto}>Salvar</Text>
          </Pressable>

          <Pressable style={styles.botaoCancelar} onPress={cancelarEdicao}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.botaoRoxo}
          onPress={() => router.replace('/' as Href)}
        >
          <Text style={styles.botaoRoxoTexto}>Sair</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        titulo="Perfil Empresa"
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
          contentContainerStyle={{ paddingBottom: 90 }}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      <RodapeFlutuante
        abaAtiva="perfil"
        aoIrParaInicio={() => router.push('/(tabs)/curriculo')}
        aoAdicionar={() => router.push('/(tabs)/rotas/produtos/editaremprego')}
        aoIrParaPerfil={() => router.push('/(tabs)/perfilempresa')}
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
    backgroundColor: AMARELO,
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitulo: {
    color: ROXO,
    fontSize: 22,
    fontWeight: 'bold',
  },

  // Card cinza que guarda a lista
  card: {
    flex: 1,
    backgroundColor: CINZA_CARD,
    borderRadius: 24,
    padding: 20,
    marginBottom: 10,
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
    marginBottom: 6,
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
    backgroundColor: '#FFF1B3',
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
  localizacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  localizacaoTextos: {
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
  // Botões (mesmo estilo do botão "Cadastrar")
  botaoRoxo: {
    backgroundColor: ROXO,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoRoxoTexto: {
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