import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <View style={styles.tela}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.areaTopo} edges={["top"]}>
        <View style={styles.topo}>
          <Image
            source={require("../../assets/vooalogo.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Vooa"
          />
          <Pressable
            style={styles.botaoPerfil}
            onPress={() => router.navigate("/perfil")}
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
            hitSlop={10}
          >
            <Ionicons
              name="person-circle-outline"
              size={27}
              color="#7B2CFF"
            />
          </Pressable>
        </View>
      </SafeAreaView>

      <Tabs
        screenOptions={{
          headerShown: false,
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

        <Tabs.Screen name="perfil" />

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
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  areaTopo: {
    backgroundColor: "#FFFFFF",
  },
  topo: {
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  logo: {
    width: 80,
    height: 40,
  },
  botaoPerfil: {
    width: 40,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
  },
});
