import { PressableComEfeito as Pressable } from '../../components/botaoInterativo';
// app/candidatar.tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, View, Text, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Header } from '../../components/header';
import { salvarEnvio } from '../rotaServidor/envios';
import { AnimacaoConteudoPagina } from '../../components/animacaoConteudoPagina';


/* ---------- cores ---------- */
const cores = {
  roxo: '#7B2FF7',
  roxoClaro: '#F8F8F8',
  roxoBorda: '#7B2FF7',
  amarelo: '#FFC83D',
  titulo: '#000000',
  texto: '#000000',
  branco: '#FFFFFF',
  erro: '#D93025',
};

const LIMITE_MB = 5;
const LIMITE_MENSAGEM = 500;

type Feedback = {
  tipo: 'erro' | 'sucesso';
  titulo: string;
  mensagem: string;
} | null;

function BotaoAnimado({
  children,
  onPress,
  style,
  hitSlop,
}: {
  children: ReactNode;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  hitSlop?: number;
}) {
  const escala = useRef(new Animated.Value(1)).current;

  const animarEscala = (toValue: number) => {
    Animated.spring(escala, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animarEscala(0.94)}
      onPressOut={() => animarEscala(1)}
      hitSlop={hitSlop}
    >
      <Animated.View style={[style, { transform: [{ scale: escala }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

/* ---------- tela ---------- */
export default function Candidatar() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idade, setIdade] = useState('');
  const [cidade, setCidade] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [anexo, setAnexo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const redirecionamento = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (redirecionamento.current) clearTimeout(redirecionamento.current);
  }, []);

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
        setFeedback({
          tipo: 'erro',
          titulo: 'Formato não permitido',
          mensagem: 'Selecione um arquivo PDF ou uma imagem.',
        });
        return;
      }

      const tamanho = arquivo.size ?? arquivo.file?.size;
      if (tamanho !== undefined && tamanho > LIMITE_MB * 1024 * 1024) {
        setFeedback({
          tipo: 'erro',
          titulo: 'Arquivo muito grande',
          mensagem: `O anexo deve ter no máximo ${LIMITE_MB} MB.`,
        });
        return;
      }

      setAnexo(arquivo);
    } catch (error) {
      setFeedback({
        tipo: 'erro',
        titulo: 'Erro ao selecionar anexo',
        mensagem: error instanceof Error ? error.message : 'Tente novamente.',
      });
    }
  }

  async function enviar() {
    const emailValido = /^\S+@\S+\.\S+$/.test(email.trim());

    if (!nome.trim() || !email.trim() || !telefone.trim() || !idade.trim() || !cidade.trim()) {
      setFeedback({
        tipo: 'erro',
        titulo: 'Campos obrigatórios',
        mensagem: 'Preencha todos os campos marcados com *.',
      });
      return;
    }
    if (!emailValido) {
      setFeedback({
        tipo: 'erro',
        titulo: 'E-mail inválido',
        mensagem: 'Digite um e-mail válido.',
      });
      return;
    }
    if (!anexo) {
      setFeedback({
        tipo: 'erro',
        titulo: 'Anexo obrigatório',
        mensagem: 'Selecione seu currículo em PDF ou uma imagem.',
      });
      return;
    }

    try {
      await salvarEnvio({
        tipo: 'vaga',
        titulo: 'Candidatura para vaga',
        empresa: 'Oportunidade de emprego',
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        idade: idade.trim(),
        cidade: cidade.trim(),
        arquivo_nome: anexo.name,
      });
      setFeedback({
        tipo: 'sucesso',
        titulo: 'Candidatura registrada',
        mensagem: 'O registro ficou salvo neste aparelho; o currículo não foi enviado a um servidor.',
      });
      redirecionamento.current = setTimeout(irParaCurriculos, 1500);
    } catch (error) {
      setFeedback({
        tipo: 'erro',
        titulo: 'Não foi possível salvar',
        mensagem: error instanceof Error ? error.message : 'Tente novamente.',
      });
    }
  }

  function irParaCurriculos() {
    if (redirecionamento.current) {
      clearTimeout(redirecionamento.current);
      redirecionamento.current = null;
    }
    router.replace('/curriculos');
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top', 'bottom']}>
      {/* Barra de topo branca, igual às outras páginas */}
      <Header />


        <AnimacaoConteudoPagina>{/* Área roxa */}
        <KeyboardAvoidingView
          style={styles.fundoRoxo}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cartao}>
              {/* Título */}
              <View style={styles.cabecalho}>
                <Text style={styles.titulo}>Candidatar-se</Text>
                <Text style={styles.subtitulo}>
                  Preencha seus dados e anexe seu currículo em PDF ou uma foto para se candidatar a esta vaga.
                </Text>
              </View>

              {/* nome */}
              <Text style={styles.rotulo}>
                Nome completo <Text style={styles.obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                placeholderTextColor={cores.texto}
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />

              {/* e-mail e telefone */}
              <View style={styles.linha}>
                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    E-mail <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor={cores.texto}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    Telefone <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu telefone"
                    placeholderTextColor={cores.texto}
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* idade e cidade */}
              <View style={styles.linha}>
                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    Idade <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua idade"
                    placeholderTextColor={cores.texto}
                    value={idade}
                    onChangeText={setIdade}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    Bairro onde mora <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu bairro"
                    placeholderTextColor={cores.texto}
                    value={cidade}
                    onChangeText={setCidade}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Anexo do currículo */}
              <Text style={styles.rotulo}>
                Currículo ou foto <Text style={styles.obrigatorio}>*</Text>
              </Text>
              <Pressable
                style={styles.upload}
                onPress={selecionarAnexo}
                accessibilityRole="button"
                accessibilityLabel={anexo ? 'Trocar anexo selecionado' : 'Selecionar currículo ou foto'}
              >
                <Ionicons
                  name={anexo ? 'document-attach-outline' : 'cloud-upload-outline'}
                  size={44}
                  color={cores.roxo}
                />
                <Text style={styles.uploadTitulo}>
                  {anexo ? anexo.name : 'Toque para anexar um arquivo ou foto'}
                </Text>
                <Text style={styles.uploadInfo}>
                  {anexo
                    ? `${anexo.size !== undefined || anexo.file?.size !== undefined
                      ? `${((anexo.size ?? anexo.file?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB`
                      : 'Tamanho indisponível'} · Toque para trocar`
                    : `PDF ou imagem (máx. ${LIMITE_MB} MB)`}
                </Text>
              </Pressable>
              {anexo && (
                <Pressable
                  style={styles.removerAnexo}
                  onPress={() => setAnexo(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Remover anexo"
                >
                  <Ionicons name="close-circle-outline" size={18} color={cores.erro} />
                  <Text style={styles.removerAnexoTexto}>Remover anexo</Text>
                </Pressable>
              )}

              {/* mensagem */}
              <Text style={styles.rotulo}>
                Mensagem <Text style={styles.opcional}>(opcional)</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputMensagem]}
                placeholder="Conte um pouco sobre você e por que quer fazer parte da nossa equipe."
                placeholderTextColor={cores.texto}
                value={mensagem}
                onChangeText={(t) => setMensagem(t.slice(0, LIMITE_MENSAGEM))}
                multiline
                textAlignVertical="top"
              />
              <Text style={styles.contador}>
                {mensagem.length}/{LIMITE_MENSAGEM}
              </Text>

              {/* enviar */}
              <BotaoAnimado style={styles.botao} onPress={enviar}>
                <Text style={styles.botaoTexto}>Enviar</Text>
              </BotaoAnimado>
            </View>
          </ScrollView>

          {/* Botão de voltar flutuante, no canto inferior esquerdo */}
          <BotaoAnimado
            style={styles.botaoVoltar}
            onPress={() => router.push('/vagasinformacao')}
            hitSlop={8}
          >
            <Image
              source={require('../../assets/images/voltar.png')}
              style={styles.iconeVoltar}
              resizeMode="contain"
            />
          </BotaoAnimado>
        </KeyboardAvoidingView>
        {feedback && (
          <View style={styles.feedbackFundo} accessibilityLiveRegion="polite">
            <View style={styles.feedbackCartao}>
              <View
                style={[
                  styles.feedbackIcone,
                  feedback.tipo === 'sucesso' ? styles.feedbackIconeSucesso : styles.feedbackIconeErro,
                ]}
              >
                <Ionicons
                  name={feedback.tipo === 'sucesso' ? 'checkmark' : 'alert'}
                  size={30}
                  color={cores.branco}
                />
              </View>
              <Text style={styles.feedbackTitulo}>{feedback.titulo}</Text>
              <Text style={styles.feedbackTexto}>{feedback.mensagem}</Text>
              <Pressable
                style={styles.feedbackBotao}
                onPress={feedback.tipo === 'sucesso' ? irParaCurriculos : () => setFeedback(null)}
                accessibilityRole="button"
              >
                <Text style={styles.feedbackBotaoTexto}>
                  {feedback.tipo === 'sucesso' ? 'Ir para currículos' : 'Entendi'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}</AnimacaoConteudoPagina>

    </SafeAreaView>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco },

  feedbackFundo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  feedbackCartao: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: cores.branco,
  },
  feedbackIcone: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
  },
  feedbackIconeSucesso: {
    backgroundColor: '#28A745',
  },
  feedbackIconeErro: {
    backgroundColor: cores.erro,
  },
  feedbackTitulo: {
    marginTop: 16,
    color: cores.titulo,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  feedbackTexto: {
    marginTop: 8,
    color: cores.texto,
    fontSize: 14,
    textAlign: 'center',
  },
  feedbackBotao: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: cores.roxo,
  },
  feedbackBotaoTexto: {
    color: cores.branco,
    fontSize: 15,
    fontWeight: '700',
  },
  fundoRoxo: { flex: 1, backgroundColor: cores.roxo },
  scroll: { padding: 16, paddingBottom: 96 },

  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 24,
    padding: 20,
  },

  cabecalho: { marginBottom: 8 },
  titulo: { fontSize: 26, fontWeight: '800', color: cores.amarelo },
  subtitulo: { fontSize: 13, color: cores.texto, lineHeight: 18, marginTop: 4 },

  rotulo: {
    fontSize: 14,
    fontWeight: '800',
    color: cores.titulo,
    marginTop: 18,
    marginBottom: 8,
  },
  obrigatorio: { color: cores.erro },
  opcional: { fontWeight: '400', color: cores.texto },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: cores.roxoBorda,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: cores.titulo,
    backgroundColor: cores.branco,
  },

  linha: { flexDirection: 'row', gap: 12 },
  coluna: { flex: 1 },

  upload: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: cores.roxoBorda,
    borderRadius: 14,
    backgroundColor: cores.roxoClaro,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 6,
  },
  uploadTitulo: { fontSize: 14, fontWeight: '800', color: cores.roxo },
  uploadInfo: { fontSize: 12, color: cores.texto },
  removerAnexo: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  removerAnexoTexto: { color: cores.erro, fontSize: 12, fontWeight: '700' },

  inputMensagem: { height: 110, paddingTop: 12 },
  contador: { alignSelf: 'flex-end', fontSize: 12, color: cores.texto, marginTop: 6 },

  botao: {
    backgroundColor: cores.amarelo,
    borderRadius: 30,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  botaoTexto: { fontSize: 16, fontWeight: '800', color: cores.titulo },

  // Botão de voltar: círculo roxo com o PNG preenchendo, fixo no canto inferior esquerdo
  botaoVoltar: {
    position: 'absolute',
    left: 6,
    bottom: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.amarelo,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // sombra no iOS
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8, // sombra no Android
  },
  iconeVoltar: { width: 48, height: 48 },
});
