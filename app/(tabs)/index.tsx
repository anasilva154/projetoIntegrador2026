import { View, StyleSheet, Text } from 'react-native';
import InputBusca from '../components/inputBusca';
import { Link } from 'expo-router';


export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}> Seu projeto integrador começa aqui!</Text>
            <Link href={"/rotas/produtos/1"} style={styles.link}>
                <Text> Click aqui para ir a página de um produto exemplo! </Text>
            </Link>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        backgroundColor: "#6868f7ff",
        justifyContent: "center",
    },
    texto: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        alignItems: "center",
        justifyContent: "center",

    },
    link: {
        color: "#133a94ff",
        fontSize: 18,
        fontWeight: "800",
        alignItems: "center",
        justifyContent: "center",
        margin: 15,
    }
});




