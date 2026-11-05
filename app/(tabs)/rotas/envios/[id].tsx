import { ContainerAnimado } from '../../../../components/entradaAnimada';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
  excluirEnvioCandidatura,
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
  const [excluindo, setExcluindo] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
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

  function confirmarExclusao() {
    if (!envio || envio.tipo !== 'vaga' || !usuario || excluindo) return;
    setConfirmandoExclusao(true);
  }

  async function excluirCurriculo() {
    if (!envio || envio.tipo !== 'vaga' || !usuario || excluindo) return;

    setConfirmandoExclusao(false);
    setExcluindo(true);
    try {
      await excluirEnvioCandidatura(envio.id, usuario.email);
      router.replace('/curriculos');
    } catch (error) {
      Alert.alert(
        'Não foi possível excluir',
        error instanceof Error ? error.message : 'Tente novamente.',
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <View style={styles.tela}>
      <Header />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <ContainerAnimado style={styles.cartao}>
          {envio ? (
            <>
              <View style={styles.cabecalhoCartao}>
                <View style={styles.icone}>
                  <Ionicons
                    name={envio.tipo === 'curso' ? 'school-outline' : 'briefcase-outline'}
                    size={30}
                    color="#D99A00"
                  />
                </View>
                <View style={styles.cabecalhoTexto}>
                  <Text style={styles.selo}>DETALHES DO ENVIO</Text>
                  <Text style={styles.titulo}>
                    {envio.titulo.replace(/\//g, '/\u200B')}
                  </Text>
                  <Text style={styles.nomeEmpresa}>{envio.empresa}</Text>
                  {envio.area ? (
                    <View style={styles.area}>
                      <Ionicons name="briefcase-outline" size={14} color="#7B2FF7" />
                      <Text style={styles.areaTexto}>{envio.area}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={[styles.divisor, styles.divisorCabecalho]} />
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
                        style={[styles.botao, styles.botaoAcao, styles.botaoCancelar]}
                        onPress={() => {
                          setEditando(false);
                          setDadosEdicao(null);
                        }}
                        disabled={salvando}
                      >
                        <Text style={styles.textoBotaoAcao}>Cancelar</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.botao, styles.botaoAcao]}
                        onPress={salvarEdicao}
                        disabled={salvando}
                      >
                        {salvando ? (
                          <ActivityIndicator color="#2B1A4D" />
                        ) : (
                          <Text
                            style={[styles.textoBotaoAcao, styles.textoSalvar]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            Salvar alterações
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  ) : (
                    <View style={styles.acoes}>
                      <Pressable
                        style={[styles.botao, styles.botaoAcao, styles.botaoEditar]}
                        onPress={iniciarEdicao}
                        accessibilityRole="button"
                      >
                        <Text style={styles.textoBotaoAcao}>Editar</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.botao, styles.botaoAcao, styles.botaoExcluir]}
                        onPress={confirmarExclusao}
                        disabled={excluindo}
                        accessibilityRole="button"
                      >
                        {excluindo ? (
                          <ActivityIndicator color="#B42318" />
                        ) : (
                          <Text style={styles.textoBotaoExcluir}>Excluir currículo</Text>
                        )}
                      </Pressable>
                    </View>
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
            <>
              <View style={styles.icone}>
                <Ionicons name="alert-circle-outline" size={30} color="#D99A00" />
              </View>
              <Text style={styles.selo}>DETALHES DO ENVIO</Text>
              <Text style={styles.titulo}>Envio não encontrado</Text>
              <Text style={styles.empresa}>
                Não foi possível abrir os detalhes deste envio. Volte à lista e tente novamente.
              </Text>
            </>
          )}
        </ContainerAnimado>
      </ScrollView>
      <Pressable
        style={styles.botaoVoltar}
        onPress={() => router.replace('/curriculos')}
        accessibilityRole="button"
        accessibilityLabel="Voltar para currículos"
        hitSlop={10}
      >
        <Image
          source={require('../../../../assets/images/voltar.png')}
          style={styles.voltarIcone}
          resizeMode="contain"
        />
      </Pressable>
      {confirmandoExclusao ? (
        <View style={styles.confirmacaoFundo}>
          <Pressable
            style={styles.confirmacaoFundoToque}
            onPress={() => setConfirmandoExclusao(false)}
            accessibilityRole="button"
            accessibilityLabel="Fechar confirmação"
          />
          <View style={styles.confirmacaoCartao} accessibilityRole="alert">
            <View style={styles.confirmacaoIcone}>
              <Ionicons name="trash-outline" size={25} color="#B42318" />
            </View>
            <Text style={styles.confirmacaoTitulo}>Excluir currículo?</Text>
            <Text style={styles.confirmacaoMensagem}>
              Esta ação removerá o currículo e as informações desta candidatura dos seus envios.
            </Text>
            <View style={styles.acoesConfirmacao}>
              <Pressable
                style={[styles.botaoConfirmacao, styles.botaoManter]}
                onPress={() => setConfirmandoExclusao(false)}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoManter}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.botaoConfirmacao, styles.botaoConfirmarExclusao]}
                onPress={() => void excluirCurriculo()}
                accessibilityRole="button"
              >
                <Text style={styles.textoConfirmarExclusao}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#7B2FF7' },
  conteudo: { flexGrow: 1, padding: 22, paddingBottom: 100 },
  botaoVoltar: {
    position: 'absolute',
    bottom: 50,
    left: 6,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F7C32E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  voltarIcone: { width: 48, height: 48 },
  cartao: {
    alignItems: 'center',
    marginTop: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#321064',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  cabecalhoCartao: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  icone: {
    width: 56,
    height: 56,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#FFF4DD',
  },
  cabecalhoTexto: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    alignItems: 'flex-start',
    marginLeft: 14,
    marginRight: 6,
  },
  selo: {
    color: '#D99A00',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  titulo: {
    width: '100%',
    marginTop: 4,
    color: '#7B2FF7',
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 28,
    flexShrink: 1,
    textAlign: 'left',
    includeFontPadding: false,
  },
  nomeEmpresa: {
    marginTop: 2,
    color: '#2B1A4D',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    flexShrink: 1,
    textAlign: 'left',
    includeFontPadding: false,
  },
  area: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  areaTexto: {
    color: '#2B1A4D',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
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
  divisorCabecalho: { marginTop: 12, marginBottom: 8 },
  linha: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  info: { flex: 1, color: '#2B1A4D', fontSize: 14 },
  secao: {
    alignSelf: 'stretch',
    marginBottom: 8,
    color: '#D99A00',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  campo: { alignSelf: 'stretch', marginTop: 12 },
  rotulo: { color: '#000000', fontSize: 12, fontWeight: '800' },
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
  botaoAcao: {
    marginTop: 0,
    minHeight: 50,
    borderRadius: 25,
    backgroundColor: '#F2BE35',
  },
  botaoCancelar: {
    flex: 0.85,
    borderWidth: 2,
    borderColor: '#F2BE35',
    backgroundColor: '#FFFFFF',
  },
  textoBotao: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  botaoEditar: { backgroundColor: '#F2BE35' },
  botaoExcluir: {
    borderWidth: 2,
    borderColor: '#D93025',
    backgroundColor: '#FFFFFF',
  },
  textoBotaoAcao: { color: '#2B1A4D', fontSize: 14, fontWeight: '800' },
  textoBotaoExcluir: { color: '#B42318', fontSize: 14, fontWeight: '800' },
  textoSalvar: { alignSelf: 'stretch', textAlign: 'center', fontSize: 13 },
  confirmacaoFundo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(25, 16, 43, 0.58)',
  },
  confirmacaoFundoToque: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  confirmacaoCartao: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  confirmacaoIcone: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#FFF0EE',
  },
  confirmacaoTitulo: {
    marginTop: 16,
    color: '#25164F',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  confirmacaoMensagem: {
    marginTop: 10,
    color: '#494451',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  acoesConfirmacao: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  botaoConfirmacao: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  botaoManter: {
    borderWidth: 1.5,
    borderColor: '#D8CEE8',
    backgroundColor: '#FFFFFF',
  },
  textoBotaoManter: { color: '#2B1A4D', fontSize: 14, fontWeight: '700' },
  botaoConfirmarExclusao: { backgroundColor: '#B42318' },
  textoConfirmarExclusao: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
