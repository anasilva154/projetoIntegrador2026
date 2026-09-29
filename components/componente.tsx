import { View, Text, FlatList, StyleSheet } from "react-native";
import CardFilme from "./CardFilme";

export default function componente() {
  return (
    <View style={styles.categorias}>
      <Text>Exemplo de componente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  categorias: {
    color: "white",
    backgroundColor: '#000000'
  },
});
