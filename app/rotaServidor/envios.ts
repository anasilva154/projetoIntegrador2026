import AsyncStorage from "@react-native-async-storage/async-storage";

export type Envio = {
  id: number;
  tipo: "vaga" | "curso";
  titulo: string;
  empresa: string;
  data_envio: string;
  status?: "enviado" | "visualizado" | "aprovado" | "recusado";
};

const CHAVE_ENVIOS = "@vooa/envios";

function validarEnvio(valor: unknown): valor is Envio {
  if (!valor || typeof valor !== "object") return false;

  const envio = valor as Record<string, unknown>;
  const statusValido =
    envio.status === undefined ||
    ["enviado", "visualizado", "aprovado", "recusado"].includes(
      String(envio.status),
    );

  return (
    typeof envio.id === "number" &&
    (envio.tipo === "vaga" || envio.tipo === "curso") &&
    typeof envio.titulo === "string" &&
    typeof envio.empresa === "string" &&
    typeof envio.data_envio === "string" &&
    statusValido
  );
}

export async function listarEnvios(): Promise<Envio[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_ENVIOS);
  if (salvo === null) return [];

  const dados: unknown = JSON.parse(salvo);
  if (!Array.isArray(dados) || !dados.every(validarEnvio)) {
    throw new Error("Os dados de currículos salvos estão inválidos.");
  }

  return dados;
}

export async function salvarEnvio(
  dados: Omit<Envio, "id" | "data_envio" | "status">,
): Promise<Envio> {
  const envios = await listarEnvios();
  let id = Date.now();
  while (envios.some((envio) => envio.id === id)) id += 1;

  const novoEnvio: Envio = {
    ...dados,
    id,
    data_envio: new Date().toISOString(),
    status: "enviado",
  };

  await AsyncStorage.setItem(
    CHAVE_ENVIOS,
    JSON.stringify([novoEnvio, ...envios]),
  );

  return novoEnvio;
}
