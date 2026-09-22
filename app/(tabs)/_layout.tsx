import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import InputBusca from "../components/inputBusca";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "left",
        headerTitle: (props) => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitleText}>{props.children}</Text>
            <View style={styles.inputContainer}>
              <InputBusca placeholder="Buscar..." />
            </View>
          </View>
        ),
        headerStyle: {
          backgroundColor: "rgb(93, 0, 7)",
          height: Platform.OS === "ios" ? 100 : 75,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "rgb(37, 6, 6)",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "rgb(9, 9, 94)",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 30 : 80,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Projeto integrador!",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "link" : "eye"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Rota de Busca dentro das abas (oculta do menu inferior com href: null) */}
      <Tabs.Screen
        name="rotas/busca/[query]"
        options={{
          title: "Busca",
          href: null,
        }}
      />

      {/* Rota de Produtos dentro das abas (oculta do menu inferior com href: null) */}
      <Tabs.Screen
        name="rotas/produtos/[id]"
        options={{
          title: "Produto",
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 16,
    gap: 12,
  },
  headerTitleText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  inputContainer: {
    flex: 1,
  },
});