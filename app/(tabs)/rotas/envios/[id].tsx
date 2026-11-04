import { ContainerAnimado } from '../../../../components/entradaAnimada';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Header } from '../../../../components/header';
import {
  atualizarEnvioCandidatura,
  type Envio,
} from '../../../rotaServidor/envios';
import { useProtegerRota } from '../../../rotaServidor/usuarioController';

const LIMITE_MB = 5;

type DadosCandidatura = Pick<
  Envio,
  'nome' | 'email' | 'telefone' | 'idade' | 'cidade' | 'mensagem' | 'arquivo_nome' | 'arquivo_uri'
>;

const camposCandidatura: { chave: keyof DadosCandidatura; rotulo: string }[] = [
  { chave: 'nome', rotulo: 'Nome completo' },
  { chave: 'email', rotulo: 'E-mail' },
  { chave: 'telefone', rotulo: 'Telefone' },
  { chave: 'idade', rotulo: 'Idade' },
  { chave: 'cidade', rotulo: 'Bairro onde mora' },
];

function lerEnvio(dados: string | undefined, id: string | undefined): Envio | null {
  if (!dados || !id) return null;

  try {
    const envio = JSON.parse(dados) as Envio;
    return String(envio.id) === id ? envio : null;
  } catch {
    return null;
  }
}

function formatarData(data: string) {
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return 'Data indisponível';

  return valor.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function DetalhesEnvio() {
  const router = useRouter();
  const { usuario } = useProtegerRota('cliente');
  const params = useLocalSearchParams<{ id?: string; dados?: string }>();
  const [envio, setEnvio] = useState(() => lerEnvio(params.dados, params.id));
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState<DadosCandidatura | null>(null);

  if (!usuario) return null;

  function iniciarEdicao() {
    if (!envio || envio.tipo !== 'vaga') return;
    setDadosEdicao({
      nome: envio.nome ?? '',
      email: envio.email ?? '',
      telefone: envio.telefone ?? '',
      idade: envio.idade ?? '',
      cidade: envio.cidade ?? '',
      mensagem: envio.mensagem ?? '',
      arquivo_nome: envio.arquivo_nome ?? '',
      arquivo_uri: envio.arquivo_uri,
    });
    setEditando(true);
  }

  async function selecionarAnexo() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (resultado.canceled) return;

      const arquivo = resultado.assets[0];
      const extensaoPermitida = /\.(pdf|jpe?g|png|gif|webp|heic|heif|bmp)$/i.test(
        arquivo.name,
      );
      const tipoPermitido = arquivo.mimeType
        ? arquivo.mimeType === 'application/pdf' || arquivo.mimeType.startsWith('image/')
        : extensaoPermitida;

      if (!tipoPermitido) {
        Alert.alert('Formato não permitido', 'Selecione um arquivo PDF ou uma imagem.');
        return;
      }

      const tamanho = arquivo.size ?? arquivo.file?.size;
      if (tamanho !== undefined && tamanho > LIMITE_MB * 1024 * 1024) {
        Alert.alert('Arquivo muito grande', `O anexo deve ter no máximo ${LIMITE_MB} MB.`);
        return;
      }

      setDadosEdicao((atual) =>
        atual ? { ...atual, arquivo_nome: arquivo.name, arquivo_uri: arquivo.uri } : atual,
      );
    } catch (error) {
      Alert.alert(
        'Erro ao selecionar anexo',
        error instanceof Error ? error.message : 'Tente novamente.',
      );
    }
  }

  async function salvarEdicao() {
    if (!envio || !dadosEdicao || !usuario) return;

    if (
      !dadosEdicao.nome?.trim() ||
      !dadosEdicao.email?.trim() ||
      !dadosEdicao.telefone?.trim() ||
      !dadosEdicao.idade?.trim() ||
      !dadosEdicao.cidade?.trim()
    ) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(dadosEdicao.email.trim())) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    setSalvando(true);
    try {
      const atualizado = await atualizarEnvioCandidatura(
        envio.id,
        usuario.email,
        {
          ...dadosEdicao,
          nome: dadosEdicao.nome.trim(),
          email: dadosEdicao.email.trim(),
          telefone: dadosEdicao.telefone.trim(),
          idade: dadosEdicao.idade.trim(),
          cidade: dadosEdicao.cidade.trim(),
          mensagem: dadosEdicao.mensagem?.trim() ?? '',
        },
      );
      setEnvio(atualizado);
      setEditando(false);
      setDadosEdicao(null);
      Alert.alert('Alterações salvas', 'As informações da candidatura foram atualizadas.');
    } catch (error) {
      Alert.alert(
        'Não foi possível salvar',
        error instanceof Error ? error.message : 'Tente novamente.',
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.tela}>
      <Header />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.back()}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.voltarTexto}>Voltar aos envios</Text>
        </Pressable>

        <ContainerAnimado style={styles.cartao}>
          <View style={styles.icone}>
            <Ionicons
              name={envio?.tipo === 'curso' ? 'school-outline' : 'briefcase-outline'}
              size={30}
              color="#8A4B0F"
            />
          </View>
          <Text style={styles.selo}>DETALHES DO ENVIO</Text>
          <Text style={styles.titulo}>
            {envio ? envio.titulo : 'Envio não encontrado'}
          </Text>

          {envio ? (
            <>
              <Text style={styles.empresa}>{envio.empresa}</Text>
              {envio.area ? <Text style={styles.empresa}>Área: {envio.area}</Text> : null}
              <View style={styles.divisor} />
              <View style={styles.linha}>
                <Ionicons name="calendar-outline" size={19} color="#7B2FF7" />
                <Text style={styles.info}>Enviado em {formatarData(envio.data_envio)}</Text>
              </View>
              <View style={styles.linha}>
                <Ionicons name="checkmark-circle-outline" size={19} color="#7B2FF7" />
                <Text style={styles.info}>
                  Status: {envio.status ?? 'enviado'}
                </Text>
              </View>
              {envio.tipo === 'vaga' ? (
                <>
                  <View style={styles.divisor} />
                  <Text style={styles.secao}>INFORMAÇÕES ENVIADAS</Text>
                  {camposCandidatura.map(({ chave, rotulo }) => (
                    <View key={chave} style={styles.campo}>
                      <Text style={styles.rotulo}>{rotulo}</Text>
                      {editando ? (
                        <TextInput
                          style={styles.input}
                          value={dadosEdicao?.[chave] ?? ''}
                          onChangeText={(valor) =>
                            setDadosEdicao((atual) =>
                              atual ? { ...atual, [chave]: valor } : atual,
                            )
                          }
                          keyboardType={chave === 'email' ? 'email-address' : chave === 'telefone' || chave === 'idade' ? 'phone-pad' : 'default'}
                          autoCapitalize={chave === 'email' ? 'none' : 'words'}
                        />
                      ) : (
                        <Text style={styles.valor}>{envio[chave] || 'Não informado'}</Text>
                      )}
                    </View>
                  ))}
                  <View style={styles.campo}>
                    <Text style={styles.rotulo}>Currículo ou foto</Text>
                    {editando ? (
                      <Pressable style={styles.anexoBotao} onPress={selecionarAnexo}>
                        <Ionicons name="document-attach-outline" size={20} color="#7B2FF7" />
                        <Text style={styles.anexoTexto}>
                          {dadosEdicao?.arquivo_nome || 'Selecionar currículo ou foto'}
                        </Text>
                      </Pressable>
                    ) : (
                      <Text style={styles.valor}>{envio.arquivo_nome || 'Não informado'}</Text>
                    )}
                  </View>
                  <View style={styles.campo}>
                    <Text style={styles.rotulo}>Mensagem</Text>
                    {editando ? (
                      <TextInput
                        style={[styles.input, styles.mensagemInput]}
                        value={dadosEdicao?.mensagem ?? ''}
                        onChangeText={(valor) =>
                          setDadosEdicao((atual) =>
                            atual ? { ...atual, mensagem: valor.slice(0, 500) } : atual,
                          )
                        }
                        multiline
                        maxLength={500}
                        textAlignVertical="top"
                      />
                    ) : (
                      <Text style={styles.valor}>{envio.mensagem || 'Não informado'}</Text>
                    )}
                  </View>
                  {editando ? (
                    <View style={styles.acoes}>
                      <Pressable
                        style={[styles.botao, styles.botaoSecundario]}
                        onPress={() => {
                          setEditando(false);
                          setDadosEdicao(null);
                        }}
                        disabled={salvando}
                      >
                        <Text style={styles.textoBotaoSecundario}>Cancelar</Text>
                      </Pressable>
                      <Pressable
                        style={styles.botao}
                        onPress={salvarEdicao}
                        disabled={salvando}
                      >
                        {salvando ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.textoBotao}>Salvar alterações</Text>
                        )}
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable style={styles.botao} onPress={iniciarEdicao}>
                      <Text style={styles.textoBotao}>Editar informações</Text>
                    </Pressable>
                  )}
                </>
              ) : (
                <>
                  {[
                    ['Nome', envio.nome],
                    ['E-mail', envio.email],
                    ['Telefone', envio.telefone],
                    ['Nascimento', envio.nascimento],
                    ['CPF', envio.cpf],
                    ['Endereço', envio.endereco],
                    ['Escolaridade', envio.escolaridade],
                    ['Turno', envio.turno],
                    ['Documento', envio.arquivo_nome],
                  ].map(([rotulo, valor]) =>
                    valor ? (
                      <View key={rotulo} style={styles.campo}>
                        <Text style={styles.rotulo}>{rotulo}</Text>
                        <Text style={styles.valor}>{valor}</Text>
                      </View>
                    ) : null,
                  )}
                </>
              )}
            </>
          ) : (
            <Text style={styles.empresa}>
              Não foi possível abrir os detalhes deste envio. Volte à lista e tente novamente.
            </Text>
          )}
        </ContainerAnimado>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#7B2FF7' },
  conteudo: { flexGrow: 1, padding: 22 },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 10,
  },
  voltarTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  cartao: {
    alignItems: 'center',
    marginTop: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  icone: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#FFF4DD',
  },
  selo: {
    marginTop: 16,
    color: '#8A4B0F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  titulo: {
    marginTop: 10,
    color: '#7B2FF7',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  empresa: {
    marginTop: 8,
    color: '#2B1A4D',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  divisor: {
    alignSelf: 'stretch',
    height: 1,
    marginVertical: 20,
    backgroundColor: '#E6E1EF',
  },
  linha: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  info: { flex: 1, color: '#2B1A4D', fontSize: 14 },
  secao: {
    alignSelf: 'stretch',
    marginBottom: 8,
    color: '#8A4B0F',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  campo: { alignSelf: 'stretch', marginTop: 12 },
  rotulo: { color: '#6A6078', fontSize: 12, fontWeight: '700' },
  valor: { marginTop: 4, color: '#2B1A4D', fontSize: 15, lineHeight: 21 },
  input: {
    minHeight: 46,
    marginTop: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    borderRadius: 10,
    color: '#2B1A4D',
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  mensagemInput: { minHeight: 110, paddingTop: 10 },
  anexoBotao: {
    minHeight: 46,
    marginTop: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    borderRadius: 10,
  },
  anexoTexto: { flex: 1, color: '#2B1A4D', fontSize: 14 },
  acoes: { alignSelf: 'stretch', flexDirection: 'row', gap: 10, marginTop: 22 },
  botao: {
    flex: 1,
    minHeight: 46,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#7B2FF7',
  },
  botaoSecundario: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#7B2FF7',
    backgroundColor: '#FFFFFF',
  },
  textoBotao: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  textoBotaoSecundario: { color: '#7B2FF7', fontSize: 14, fontWeight: '800' },
});
