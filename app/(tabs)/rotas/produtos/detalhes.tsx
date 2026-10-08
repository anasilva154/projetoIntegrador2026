import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Item = {
  id: number;
  tipo: "vaga" | "curso";
  titulo: string;
  empresa: string;
  cidade: string;
  quantidade: number;
  presencial: boolean;
  sobre: string;
  setor: string;
  requisitos: string;
  salario: string;
  periodo: string;
  duracao: string;
  cargaHoraria: string;
};

const ROXO = "#7B2FF7";
const ROXO_CLARO = "#ECE8FB";
const AMARELO = "#F5B81C";
const CINZA = "#D6D6D6";
const MARINHO = "#1A1446";
const BRANCO = "#FFFFFF";

// Cada linha do texto vira um item da lista
function linhas(texto: string) {
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function Lista({ titulo, texto }: { titulo: string; texto: string }) {
  const itens = linhas(texto);
  if (itens.length === 0) return null;

  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      {itens.map((linha, i) => (
        <View key={i} style={styles.bulletLinha}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletTexto}>{linha}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Detalhes() {
  const router = useRouter();
  const { dados } = useLocalSearchParams<{ dados: string }>();

  if (!dados) {
    return (
      <View style={styles.tela}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Detalhes indisponíveis</Text>
          <Text style={styles.empresa}>
            Volte à lista e toque em uma vaga ou curso para ver as informações.
          </Text>
          <Pressable
            style={styles.botaoCandidatar}
            onPress={() => router.replace("/rotas/produtos/editaremprego")}
            accessibilityRole="button"
          >
            <Text style={styles.botaoCandidatarTexto}>Voltar para a lista</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  const item: Item = JSON.parse(Array.isArray(dados) ? dados[0] : dados);

  const ehCurso = item.tipo === "curso";
  const modalidade = item.presencial ? "Presencial" : "Não presencial";

  const localTexto = [item.cidade, modalidade].filter(Boolean).join(" · ");
  const setorTexto = [item.setor, item.titulo].filter(Boolean).join(" · ");

  // Caixa de baixo: muda conforme o tipo
  const infos = ehCurso
    ? [
        { icone: "calendar" as const, rotulo: "Período", valor: item.periodo },
        { icone: "hourglass" as const, rotulo: "Duração", valor: item.duracao },
        { icone: "time" as const, rotulo: "Carga horária", valor: item.cargaHoraria },
      ]
    : [
        { icone: null, rotulo: "Salário", valor: item.salario },
        { icone: "time" as const, rotulo: "Carga horária", valor: item.cargaHoraria },
      ];
  const infosPreenchidas = infos.filter((i) => i.valor);

  return (
    <View style={styles.tela}>
      {/* Topo branco */}
      <View style={styles.cabecalho}>
        <Image
          source={require("../../../../assets/images/vooa.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require("../../../../assets/images/do-utilizador.png")}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>

      {/* Card branco */}
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardConteudo}
        >
          <View style={styles.tag}>
            <Text style={styles.tagTexto}>{ehCurso ? "CURSO" : "VAGA"}</Text>
          </View>

          <Text style={styles.titulo}>{item.titulo}</Text>
          {!!item.empresa && <Text style={styles.empresa}>{item.empresa}</Text>}

          <Lista titulo={ehCurso ? "Sobre o curso" : "Sobre a vaga"} texto={item.sobre} />

          {(!!localTexto || !!setorTexto) && (
            <View style={styles.caixaInfo}>
              {!!localTexto && (
                <View style={styles.infoLinha}>
                  <Ionicons name="location-outline" size={20} color="#000" />
                  <Text style={styles.infoTexto}>{localTexto}</Text>
                </View>
              )}
              {!!setorTexto && (
                <View style={styles.infoLinha}>
                  <Ionicons name="briefcase-outline" size={20} color="#000" />
                  <Text style={styles.infoTexto}>{setorTexto}</Text>
                </View>
              )}
            </View>
          )}

          {!ehCurso && <Lista titulo="Requisitos" texto={item.requisitos} />}

          {infosPreenchidas.length > 0 && (
            <View style={styles.caixaNumeros}>
              {infosPreenchidas.map((info, i) => (
                <View key={info.rotulo} style={styles.numero}>
                  {i > 0 && <View style={styles.divisor} />}
                  {info.icone ? (
                    <Ionicons name={info.icone} size={30} color="#000" />
                  ) : (
                    <View style={styles.cifrao}>
                      <Text style={styles.cifraoTexto}>$</Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.numeroRotulo}>{info.rotulo}</Text>
                    <Text style={styles.numeroValor}>{info.valor}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

      </View>

      {/* Botão voltar flutuante */}
      <Pressable
        style={styles.botaoVoltar}
        onPress={() => router.replace("/rotas/produtos/editaremprego")}
        accessibilityLabel="Voltar"
      >
        <Ionicons name="chevron-back" size={30} color={BRANCO} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: ROXO,
  },

  /* Topo */
  cabecalho: {
    height: 105,
    backgroundColor: BRANCO,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 200,
    height: 100,
    marginLeft: -34,
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 16,
  },

  /* Card */
  card: {
    flex: 1,
    backgroundColor: BRANCO,
    borderRadius: 24,
    margin: 16,
    overflow: "hidden",
  },
  cardConteudo: {
    padding: 20,
    paddingBottom: 12,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: ROXO_CLARO,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  tagTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: MARINHO,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
  },
  empresa: {
    fontSize: 15,
    color: "#222",
    marginTop: 2,
  },

  /* Seções com bullets */
  secao: {
    marginTop: 28,
  },
  secaoTitulo: {
    fontSize: 17,
    fontWeight: "800",
    color: "#000",
    marginBottom: 8,
  },
  bulletLinha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 20,
    color: "#000",
  },
  bulletTexto: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#000",
  },

  /* Caixa cinza com local/setor */
  caixaInfo: {
    backgroundColor: CINZA,
    borderRadius: 16,
    padding: 16,
    marginTop: 28,
    gap: 10,
  },
  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoTexto: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },

  /* Caixa cinza com salário / carga horária */
  caixaNumeros: {
    flexDirection: "row",
    backgroundColor: CINZA,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 28,
  },
  numero: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divisor: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#C8C8C8",
    marginRight: 6,
  },
  cifrao: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  cifraoTexto: {
    color: BRANCO,
    fontWeight: "800",
    fontSize: 16,
  },
  numeroRotulo: {
    fontSize: 11,
    color: "#222",
  },
  numeroValor: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000",
  },

  botaoCandidatar: {
    backgroundColor: AMARELO,
    borderRadius: 30,
    height: 52,
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 40,
  },
  botaoCandidatarTexto: {
    fontSize: 17,
    fontWeight: "800",
    color: "#000",
  },

  /* Voltar flutuante */
  botaoVoltar: {
    position: "absolute",
    left: 6,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: ROXO,
    borderWidth: 4,
    borderColor: BRANCO,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
});