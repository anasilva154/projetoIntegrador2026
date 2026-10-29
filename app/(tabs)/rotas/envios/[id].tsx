import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../../../../components/header";
import type { Envio } from "../../../rotaServidor/envios";

function isEnvio(valor: unknown): valor is Envio {
  if (!valor || typeof valor !== "object") return false;

  const envio = valor as Record<string, unknown>;
  return (
    typeof envio.id === "number" &&
    (envio.tipo === "vaga" || envio.tipo === "curso") &&
    typeof envio.titulo === "string" &&
    typeof envio.empresa === "string" &&
    typeof envio.data_envio === "string" &&
    (envio.status === undefined ||
      ["enviado", "visualizado", "aprovado", "recusado"].includes(
        String(envio.status),
      ))
  );
}

function lerEnvio(dados: string | undefined, id: string | undefined): Envio | null {
  if (!dados || !id) return null;

  try {
    const valor: unknown = JSON.parse(dados);
    if (!isEnvio(valor)) return null;
    const envio = valor;
    return String(envio.id) === id ? envio : null;
  } catch {
    return null;
  }
}

function formatarData(data: string) {
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return "Data indisponível";

  return valor.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function DetalhesEnvio() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; dados?: string }>();
  const envio = useMemo(
    () => lerEnvio(params.dados, params.id),
    [params.dados, params.id],
  );

  return (
    <View style={styles.tela}>
      <Header />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable
          style={styles.voltar}
          onPress={() => router.back()}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color="#7B2FF7" />
          <Text style={styles.voltarTexto}>Voltar aos currículos</Text>
        </Pressable>

        <View style={styles.cartao}>
          <View style={styles.icone}>
            <Ionicons
              name={envio?.tipo === "curso" ? "school-outline" : "briefcase-outline"}
              size={30}
              color="#8A4B0F"
            />
          </View>
          <Text style={styles.selo}>DETALHES DO ENVIO</Text>
          <Text style={styles.titulo}>
            {envio ? envio.titulo : "Envio não encontrado"}
          </Text>

          {envio ? (
            <>
              <Text style={styles.empresa}>{envio.empresa}</Text>
              <View style={styles.divisor} />
              <View style={styles.linha}>
                <Ionicons name="calendar-outline" size={19} color="#7B2FF7" />
                <Text style={styles.info}>Enviado em {formatarData(envio.data_envio)}</Text>
              </View>
              <View style={styles.linha}>
                <Ionicons name="checkmark-circle-outline" size={19} color="#7B2FF7" />
                <Text style={styles.info}>
                  Status: {envio.status ?? "enviado"}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.empresa}>
              Não foi possível abrir os detalhes deste envio. Volte à lista e tente novamente.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#7B2FF7" },
  conteudo: { flexGrow: 1, padding: 22 },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 10,
  },
  voltarTexto: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  cartao: {
    alignItems: "center",
    marginTop: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  icone: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#FFF4DD",
  },
  selo: {
    marginTop: 16,
    color: "#8A4B0F",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  titulo: {
    marginTop: 10,
    color: "#7B2FF7",
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
  },
  empresa: {
    marginTop: 8,
    color: "#2B1A4D",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  divisor: {
    alignSelf: "stretch",
    height: 1,
    marginVertical: 20,
    backgroundColor: "#E6E1EF",
  },
  linha: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  info: { flex: 1, color: "#2B1A4D", fontSize: 14 },
});
