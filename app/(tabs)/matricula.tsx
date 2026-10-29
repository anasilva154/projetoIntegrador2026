import { PressableComEfeito as Pressable } from '../../components/botaoInterativo';
// app/matricula.tsx
import { useRef, useState, type ReactNode } from 'react';
import { Animated, View, Text, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
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
  sucesso: '#2E9E5B',
};

const LIMITE_MB = 5;

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
  const [nascimento, setNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [turno, setTurno] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [documento, setDocumento] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  async function selecionarDocumento() {
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
        Alert.alert('Formato não permitido', 'Selecione um PDF ou uma imagem.');
        return;
      }

      const tamanho = arquivo.size ?? arquivo.file?.size;
      if (tamanho !== undefined && tamanho > LIMITE_MB * 1024 * 1024) {
        Alert.alert('Arquivo muito grande', `O documento deve ter no máximo ${LIMITE_MB} MB.`);
        return;
      }

      setDocumento(arquivo);
    } catch (error) {
      Alert.alert(
        'Erro ao selecionar documento',
        error instanceof Error ? error.message : 'Tente novamente.',
      );
    }
  }

  async function enviar() {
    const emailValido = /^\S+@\S+\.\S+$/.test(email.trim());

    if (
      !nome.trim() ||
      !nascimento.trim() ||
      !cpf.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !endereco.trim() ||
      !escolaridade.trim() ||
      !turno.trim()
    ) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *.');
      return;
    }
    if (!emailValido) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    try {
      await salvarEnvio({
        tipo: 'curso',
        titulo: 'Curso Técnico em Informática',
        empresa: 'Faculdade Senac',
        nome: nome.trim(),
        nascimento: nascimento.trim(),
        cpf: cpf.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        escolaridade: escolaridade.trim(),
        turno: turno.trim(),
        arquivo_nome: documento?.name ?? '',
      });
      setEnviado(true);
    } catch (error) {
      Alert.alert(
        'Não foi possível salvar',
        error instanceof Error ? error.message : 'Tente novamente.',
      );
    }
  }

  function fecharAviso() {
    setEnviado(false);
    router.replace('/cursosinfo');
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
                <Text style={styles.titulo}>Matricular-se</Text>
                <Text style={styles.subtitulo}>
                  Preencha seus dados para realizar a matrícula neste curso.
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

              {/* data de nascimento e CPF */}
              <View style={styles.linha}>
                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    Nascimento <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="dd/mm/aaaa"
                    placeholderTextColor={cores.texto}
                    value={nascimento}
                    onChangeText={setNascimento}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    CPF <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu CPF"
                    placeholderTextColor={cores.texto}
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

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

              {/* Endereço */}
              <Text style={styles.rotulo}>
                Endereço completo <Text style={styles.obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Rua, número, bairro, cidade"
                placeholderTextColor={cores.texto}
                value={endereco}
                onChangeText={setEndereco}
                autoCapitalize="words"
              />

              {/* escolaridade e turno */}
              <View style={styles.linha}>
                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    Escolaridade <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex.: Ensino médio"
                    placeholderTextColor={cores.texto}
                    value={escolaridade}
                    onChangeText={setEscolaridade}
                    autoCapitalize="sentences"
                  />
                </View>

                <View style={styles.coluna}>
                  <Text style={styles.rotulo}>
                    Turno <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex.: Noturno"
                    placeholderTextColor={cores.texto}
                    value={turno}
                    onChangeText={setTurno}
                    autoCapitalize="sentences"
                  />
                </View>
              </View>

              {/* documento de identidade */}
              <Text style={styles.rotulo}>
                Documento
              </Text>
              <Pressable
                style={styles.upload}
                onPress={selecionarDocumento}
                accessibilityRole="button"
                accessibilityLabel={documento ? 'Trocar documento selecionado' : 'Selecionar documento'}
              >
                <Ionicons
                  name={documento ? 'document-attach-outline' : 'cloud-upload-outline'}
                  size={44}
                  color={cores.roxo}
                />
                <Text style={styles.uploadTitulo}>
                  {documento ? documento.name : 'Toque para anexar seu documento'}
                </Text>
                <Text style={styles.uploadInfo}>
                  {documento
                    ? `${documento.size !== undefined || documento.file?.size !== undefined
                      ? `${((documento.size ?? documento.file?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB`
                      : 'Tamanho indisponível'} · Toque para trocar`
                    : `RG ou comprovante de residência em PDF ou imagem (máx. ${LIMITE_MB} MB)`}
                </Text>
              </Pressable>

              {/* enviar */}
              <BotaoAnimado style={styles.botao} onPress={enviar}>
                <Text style={styles.botaoTexto}>Matricular-se</Text>
              </BotaoAnimado>
            </View>
          </ScrollView>

          {/* Botão de voltar flutuante: leva para a tela do curso */}
          <BotaoAnimado
            style={styles.botaoVoltar}
            onPress={() => router.replace('/cursosinfo')}
            hitSlop={8}
          >
            <Image
              source={require('../../assets/images/voltar.png')}
              style={styles.iconeVoltar}
              resizeMode="contain"
            />
          </BotaoAnimado>
        </KeyboardAvoidingView>

        {/* Aviso de matrícula enviada */}</AnimacaoConteudoPagina>
        <Modal visible={enviado} transparent animationType="fade" onRequestClose={fecharAviso}>
          <View style={styles.avisoFundo}>
            <View style={styles.avisoCartao}>
              <View style={styles.avisoIcone}>
                <Ionicons name="checkmark" size={40} color={cores.branco} />
              </View>
              <Text style={styles.avisoTitulo}>Matrícula enviada!</Text>
              <Text style={styles.avisoTexto}>
                Recebemos os seus dados. Em breve entraremos em contato.
              </Text>
              <Pressable style={styles.avisoBotao} onPress={fecharAviso}>
                <Text style={styles.avisoBotaoTexto}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

    </SafeAreaView>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco },

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
  // justifyContent: 'flex-end' alinha os campos pela base, mesmo se um rótulo quebrar
  coluna: { flex: 1, justifyContent: 'flex-end' },

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

  // Aviso de matrícula enviada
  avisoFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avisoCartao: {
    width: '100%',
    backgroundColor: cores.branco,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  avisoIcone: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.sucesso,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avisoTitulo: { fontSize: 22, fontWeight: '800', color: cores.titulo },
  avisoTexto: {
    fontSize: 14,
    color: cores.texto,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  avisoBotao: {
    backgroundColor: cores.amarelo,
    borderRadius: 26,
    height: 48,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  avisoBotaoTexto: { fontSize: 16, fontWeight: '800', color: cores.titulo },
});
