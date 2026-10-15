// app/matricula.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ---------- cores ---------- */
const cores = {
  roxo: '#7B2FF7',
  roxoClaro: '#F5F2FF',
  roxoBorda: '#D9D0F5',
  amarelo: '#FFC83D',
  titulo: '#25164F',
  texto: '#6B6B80',
  branco: '#FFFFFF',
  erro: '#D93025',
  sucesso: '#2E9E5B',
};

const LIMITE_MB = 5;

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

  function enviar() {
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

    // TODO: enviar os dados para o servidor
    setEnviado(true);
  }

  function fecharAviso() {
    setEnviado(false);
    router.replace('/cursosinfo');
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top', 'bottom']}>
      {/* barra de topo branca (igual às outras páginas) */}
      <View style={styles.topo}>
        <Image
          source={require('../../assets/images/vooalogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.perfil}>
          <Image
            source={require('../../assets/images/do-utilizador.png')}
            style={styles.perfilIcone}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* área roxa */}
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
            {/* título */}
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

            {/* endereço */}
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

            {/* documento de identidade (só visual, ainda não funciona) */}
            <Text style={styles.rotulo}>
              Documento<Text style={styles.opcional}></Text>
            </Text>
            <Pressable
              style={styles.upload}
              onPress={() => {
                // TODO: abrir seletor de arquivo
              }}
            >
              <Ionicons name="cloud-upload-outline" size={44} color={cores.roxo} />
              <Text style={styles.uploadTitulo}>Clique para anexar seu documento</Text>
              <Text style={styles.uploadInfo}>RG ou Comprovante de Residência (máx. {LIMITE_MB}MB)</Text>
            </Pressable>

            {/* enviar */}
            <Pressable style={styles.botao} onPress={enviar}>
              <Text style={styles.botaoTexto}>Matricular-se</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* botão de voltar flutuante: leva para a tela do curso */}
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => router.replace('/cursosinfo')}
          hitSlop={8}
        >
          <Image
            source={require('../../assets/images/voltar.png')}
            style={styles.iconeVoltar}
            resizeMode="contain"
          />
        </Pressable>
      </KeyboardAvoidingView>

      {/* aviso de matrícula enviada */}
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

  topo: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  logo: { width: 80, height: 100, marginTop: 10 },
  perfilIcone: { width: 40, height: 27 },

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

  // botão de voltar: círculo roxo com o PNG preenchendo, fixo no canto inferior esquerdo
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

  // aviso de matrícula enviada
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