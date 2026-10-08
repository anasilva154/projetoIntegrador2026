import { useLocalSearchParams } from "expo-router";

export default function Detalhes() {
  const { dados } = useLocalSearchParams<{ dados: string }>();
  const item = JSON.parse(dados);
  // item.tipo, item.titulo, item.sobre, item.salario, item.periodo etc.
}