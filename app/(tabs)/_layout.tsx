import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // remove o header vermelho e a barra de busca
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

      <Tabs.Screen
        name="rotas/busca/[query]"
        options={{
          title: "Busca",
          href: null,
        }}
      />

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