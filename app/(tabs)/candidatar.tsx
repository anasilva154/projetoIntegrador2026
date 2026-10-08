// app/candidatar.tsx
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
};

const LIMITE_MB = 5;
const LIMITE_MENSAGEM = 500;

/* ---------- máscara de telefone: (99) 99999-9999 ---------- */
function mascararTelefone(valor: string) {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  if (n.length === 0) return '';
  if (n.length <= 2) return `(${n}`;
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
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

  function enviar() {
    const emailValido = /^\S+@\S+\.\S+$/.test(email.trim());

    if (!nome.trim() || !email.trim() || !telefone.trim() || !idade.trim() || !cidade.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *.');
      return;
    }
    if (!emailValido) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    // TODO: enviar os dados para o servidor
    Alert.alert('Candidatura enviada!', 'Boa sorte!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
            {/* voltar */}
            <Pressable style={styles.voltar} onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="arrow-back" size={20} color={cores.roxo} />
              <Text style={styles.voltarTexto}>Voltar</Text>
            </Pressable>

            {/* título */}
            <View style={styles.cabecalho}>
              <View style={styles.cabecalhoIcone}>
                <Ionicons name="document-text-outline" size={30} color={cores.branco} />
              </View>
              <View style={styles.cabecalhoTextos}>
                <Text style={styles.titulo}>Candidatar-se</Text>
                <Text style={styles.subtitulo}>
                  Preencha seus dados e anexe o seu currículo em PDF para se candidatar a esta
                  vaga.
                </Text>
              </View>
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
                  placeholder="(  ) _____-_____"
                  placeholderTextColor={cores.texto}
                  value={telefone}
                  onChangeText={(t) => setTelefone(mascararTelefone(t))}
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
                  onChangeText={(t) => setIdade(t.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.coluna}>
                <Text style={styles.rotulo}>
                  Cidade onde mora <Text style={styles.obrigatorio}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua cidade"
                  placeholderTextColor={cores.texto}
                  value={cidade}
                  onChangeText={setCidade}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* currículo (só visual, ainda não funciona) */}
            <Text style={styles.rotulo}>
              Currículo (PDF) <Text style={styles.obrigatorio}>*</Text>
            </Text>
            <Pressable
              style={styles.upload}
              onPress={() => {
                // TODO: abrir seletor de arquivo
              }}
            >
              <Ionicons name="cloud-upload-outline" size={44} color={cores.roxo} />
              <Text style={styles.uploadTitulo}>Clique para anexar seu currículo</Text>
              <Text style={styles.uploadInfo}>Arquivos em PDF (máx. {LIMITE_MB}MB)</Text>
            </Pressable>

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
            <Pressable style={styles.botao} onPress={enviar}>
              <Text style={styles.botaoTexto}>Enviar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scroll: { padding: 16, paddingBottom: 24 },

  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 24,
    padding: 20,
  },

  voltar: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  voltarTexto: { fontSize: 15, fontWeight: '700', color: cores.roxo },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  cabecalhoIcone: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9B6BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cabecalhoTextos: { flex: 1 },
  titulo: { fontSize: 26, fontWeight: '800', color: cores.titulo },
  subtitulo: { fontSize: 13, color: cores.texto, lineHeight: 18, marginTop: 2 },

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
});