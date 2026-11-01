// app/(tabs)/perfilempresa.tsx
import { useEffect, useState } from 'react';
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
import { Header as HeaderLogo } from '../../components/header';
import {
  atualizarUsuarioLogado,
  logoutUsuario,
  obterUsuarioLogado,
  useProtegerRota,
} from '../rotaServidor/usuarioController';

const ROXO = '#7B2FF7';
const AMARELO = '#FFC700';
const CINZA_CARD = '#EBEBEB';
const CINZA_INPUT = '#F8F8F8';
const TEXTO = '#333333';
const LOCALIZACAO_PADRAO =
  'Rua Exemplo, 123, próximo ao Senac, Criciúma - SC';

type Perfil = {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
};

type ChaveTexto = 'nome' | 'cnpj' | 'telefone' | 'email' | 'endereco';

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
          color={ROXO}
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
      <Ionicons name="business" size={48} color="#808080" />

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
          <Text style={styles.valor}>{valor || 'Não informado'}</Text>
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

function Divisor() {
  return <View style={styles.divisor} />;
}

export default function PerfilEmpresaScreen() {
  const router = useRouter();
  const { usuario, setUsuario } = useProtegerRota('empresa');

  const [perfil, setPerfil] = useState<Perfil>({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: LOCALIZACAO_PADRAO,
  });
  const [rascunho, setRascunho] = useState<Perfil>(perfil);
  const [editando, setEditando] = useState(false);
  const [mostrarCnpj, setMostrarCnpj] = useState(false);

  // Carrega os dados da empresa logada a partir do AsyncStorage
  useEffect(() => {
    if (!usuario) return;

    const dadosEmpresa: Perfil = {
      nome: usuario.nome || '',
      cnpj: usuario.cnpj || '',
      telefone: usuario.telefone || '',
      email: usuario.email || '',
      endereco: usuario.endereco || LOCALIZACAO_PADRAO,
    };
    obterUsuarioLogado().then((logado) => {
      if (!logado) return;
      setPerfil(dadosEmpresa);
      setRascunho(dadosEmpresa);
  
    });

  }, [usuario]);

  if (!usuario) return null;

  const atual = editando ? rascunho : perfil;

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
        cnpj: rascunho.cnpj,
        telefone: rascunho.telefone,
        email: rascunho.email,
        endereco: rascunho.endereco,
      });
      setUsuario(atualizado);
      setPerfil(rascunho);
      setEditando(false);
      Alert.alert('Sucesso', 'Dados da empresa atualizados!');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const sair = async () => {
    await logoutUsuario();
    router.replace('/' as Href);
  };

  const atualizarTexto = (chave: ChaveTexto, texto: string) => {
    setRascunho((r) => ({ ...r, [chave]: texto }));
  };

  const abrirLocalizacao = async () => {
    const enderecoBusca = atual.endereco || LOCALIZACAO_PADRAO;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoBusca)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
    }
  };

  const cnpjMascarado = '••.•••.•••/••••-••';

  const dados: ItemCampo[] = [
    {
      id: '1',
      chave: 'nome',
      icone: 'business',
      rotulo: 'Nome da empresa',
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
        <View style={styles.campo}>
          <Ionicons name="location" size={22} color={ROXO} />
          <View style={styles.campoTextos}>
            <Text style={styles.rotulo}>Localização</Text>
            <TextInput
              style={styles.input}
              value={atual.endereco}
              onChangeText={(texto) => atualizarTexto('endereco', texto)}
            />
          </View>
        </View>
      ) : (
        <Pressable
          style={styles.localizacao}
          onPress={abrirLocalizacao}
          accessibilityRole="link"
          accessibilityLabel={`Abrir localização: ${atual.endereco} no Google Maps`}
        >
          <Ionicons name="location" size={22} color={ROXO} />
          <View style={styles.localizacaoTextos}>
            <Text style={styles.rotulo}>Localização</Text>
            <Text style={styles.valor}>{atual.endereco || LOCALIZACAO_PADRAO}</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={ROXO} />
        </Pressable>
      )}

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
        <Pressable style={styles.botaoRoxo} onPress={sair}>
          <Text style={styles.botaoRoxoTexto}>Sair</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderLogo />

      <View style={styles.conteudo}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AMARELO },
  conteudo: { flex: 1, paddingTop: 30, paddingHorizontal: 20 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitulo: { color: ROXO, fontSize: 22, fontWeight: 'bold' },
  card: {
    flex: 1,
    backgroundColor: CINZA_CARD,
    borderRadius: 24,
    padding: 20,
    marginBottom: 10,
  },
  topo: { alignItems: 'center', marginBottom: 20 },
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
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  campoTextos: { flex: 1 },
  localizacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  localizacaoTextos: { flex: 1 },
  rotulo: { color: '#777', fontSize: 12 },
  valor: { color: TEXTO, fontSize: 16, fontWeight: '500' },
  input: {
    backgroundColor: CINZA_INPUT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    fontSize: 16,
    color: TEXTO,
  },
  divisor: { height: 1, backgroundColor: '#D6D6D6' },
  botaoRoxo: {
    backgroundColor: ROXO,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoRoxoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  botaoCancelar: { paddingVertical: 12, alignItems: 'center' },
  botaoCancelarTexto: { color: '#777', fontSize: 15, fontWeight: '600' },
});
