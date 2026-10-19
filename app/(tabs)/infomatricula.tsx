import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const cores = {
  fundo: "#7B2CFF",
  escuro: "#1F1257",
  texto: "#5A4A9C",
  amarelo: "#FFD22E",
  branco: "#FFFFFF",
  cinza: "#FFFFFF",
  cinzaCard: "#FFFFFF",
  vermelho: "#FF5A5F",
};

const matricula = {
  nome: "Ana Beatriz Souza",
  nascimento: "12/03/2006",
  cpf: "123.456.789-00",
  email: "ana.beatriz@email.com",
  telefone: "(48) 99999-1234",
  escolaridade: "Ensino Médio completo",
  turno: "Manhã",
  documento: {
    nome: "Documento_AnaBeatriz.pdf",
    detalhe: "PDF • 312 KB",
    url: "https://exemplo.com/Documento_AnaBeatriz.pdf",
  },
};

const dadosMatricula: {
  rotulo: string;
  valor: string;
  icone: keyof typeof Ionicons.glyphMap;
}[] = [
  { rotulo: "Nome completo", valor: matricula.nome, icone: "person" },
  { rotulo: "Nascimento", valor: matricula.nascimento, icone: "calendar" },
  { rotulo: "CPF", valor: matricula.cpf, icone: "card" },
  { rotulo: "E-mail", valor: matricula.email, icone: "mail" },
  { rotulo: "Telefone", valor: matricula.telefone, icone: "call" },
  { rotulo: "Escolaridade", valor: matricula.escolaridade, icone: "school" },
  { rotulo: "Turno", valor: matricula.turno, icone: "time" },
];

export default function PdfMatriculaScreen() {
  const router = useRouter();

  async function abrirDocumento() {
    try {
      await Linking.openURL(matricula.documento.url);
    } catch {
      Alert.alert("Erro", "Não foi possível baixar o documento.");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudoScroll}>
        <Text style={styles.titulo}>Matrícula</Text>
        <Text style={styles.subtitulo}>
          Confira os dados e o documento enviado pelo aluno.
        </Text>

        <View style={styles.cardDados}>
          {dadosMatricula.map((item, index) => (
            <View key={item.rotulo}>
              {index > 0 && <View style={styles.divisor} />}
              <View style={styles.campo}>
                <Ionicons name={item.icone} size={22} color={cores.fundo} />
                <View style={styles.campoTextos}>
                  <Text style={styles.rotulo}>{item.rotulo}</Text>
                  <Text style={styles.valor}>{item.valor}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.cardArquivo} onPress={abrirDocumento}>
          <View style={styles.pdfIcone}>
            <Text style={styles.pdfIconeTexto}>PDF</Text>
          </View>
          <View style={styles.arquivoInfo}>
            <Text style={styles.arquivoNome} numberOfLines={1}>
              {matricula.documento.nome}
            </Text>
            <Text style={styles.arquivoDetalhe}>
              {matricula.documento.detalhe}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={cores.escuro} />
        </Pressable>
      </ScrollView>

      <Pressable
        style={styles.botaoVoltar}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        hitSlop={10}
      >
        <Image
          source={require("../../assets/voltar 1.png")}
          style={styles.voltarIcone}
          resizeMode="contain"
          accessibilityLabel="Seta para voltar"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  conteudoScroll: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 150,
  },
  titulo: { fontSize: 24, fontWeight: "800", color: cores.branco },
  subtitulo: {
    fontSize: 15,
    color: cores.branco,
    marginTop: 2,
    marginBottom: 16,
  },
  cardArquivo: {
    backgroundColor: cores.branco,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 4,
  },
  pdfIcone: {
    width: 44,
    height: 54,
    borderRadius: 8,
    backgroundColor: cores.vermelho,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  pdfIconeTexto: { color: cores.branco, fontSize: 13, fontWeight: "800" },
  arquivoInfo: { flex: 1, gap: 4 },
  arquivoNome: { fontSize: 16, fontWeight: "800", color: cores.escuro },
  arquivoDetalhe: { fontSize: 13, color: cores.texto },
  cardDados: {
    backgroundColor: cores.cinzaCard,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  campoTextos: { flex: 1 },
  rotulo: { color: "#777777", fontSize: 12 },
  valor: { color: "#333333", fontSize: 16, fontWeight: "500" },
  divisor: { height: 1, backgroundColor: "#D6D6D6" },
  botaoVoltar: {
    position: "absolute",
    bottom: 82,
    left: 6,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.amarelo,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  voltarIcone: { width: 48, height: 48 },
});