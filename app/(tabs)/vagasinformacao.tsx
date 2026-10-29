import { PressableComEfeito as Pressable } from '../../components/botaoInterativo';
// app/(tabs)/vaga.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, type ReactNode } from 'react';
import { Header } from '../../components/header';
import { Animated, View, Text, Image, ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { AnimacaoConteudoPagina } from '../../components/animacaoConteudoPagina';


const vaga = {
  titulo: 'Jovem Aprendiz / Auxiliar',
  empresa: 'Nova Geração Soluções',
  sobre: [
    'Auxiliar na organização de documentos;',
    'Apoiar a equipe nas tarefas do dia a dia;',
    'Preencher planilhas e cadastrar informações;',
    'Auxiliar no atendimento ao cliente.',
  ],
  local: 'Criciúma, SC · Presencial',
  area: 'Administrativo · Jovem Aprendiz',
  requisitos: [
    'Ensino médio cursando',
    'Boa comunicação',
    'Organização',
    'Informática básica',
  ],
  salario: 'R$ 1.000,00',
  carga: '6h/dia',
};

function Lista({ itens }: { itens: string[] }) {
  return (
    <View>
      {itens.map((item, i) => (
        <View key={i} style={styles.itemLinha}>
          <View style={styles.bolinha} />
          <Text style={styles.itemTexto}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function BotaoAnimado({
  children,
  onPress,
  style,
  hitSlop,
}: {
  children: ReactNode;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  hitSlop?: number;
}) {
  const escala = useRef(new Animated.Value(1)).current;

  const animarEscala = (toValue: number) => {
    Animated.spring(escala, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animarEscala(0.94)}
      onPressOut={() => animarEscala(1)}
      hitSlop={hitSlop}
    >
      <Animated.View style={[style, { transform: [{ scale: escala }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Vaga() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header: logo (esquerda) e perfil (direita) */}
      <Header />


        <AnimacaoConteudoPagina>{/* ScrollView só rola se a tela for muito pequena */}
        <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View>
              <View style={styles.tag}>
                <Text style={styles.txtTag}>VAGA</Text>
              </View>
              <Text style={styles.titulo}>{vaga.titulo}</Text>
              <Text style={styles.empresa}>{vaga.empresa}</Text>
            </View>

            <View>
              <Text style={styles.secao}>Sobre a vaga</Text>
              <Lista itens={vaga.sobre} />
            </View>

            <View style={styles.caixaInfo}>
              <View style={styles.infoLinha}>
                <Ionicons name="location-outline" size={18} color="#000" />
                <Text style={styles.infoTexto}>{vaga.local}</Text>
              </View>
              <View style={styles.infoLinha}>
                <Ionicons name="briefcase-outline" size={18} color="#000" />
                <Text style={styles.infoTexto}>{vaga.area}</Text>
              </View>
            </View>

            <View>
              <Text style={styles.secao}>Requisitos</Text>
              <Lista itens={vaga.requisitos} />
            </View>

            <View style={styles.caixaValores}>
              <View style={styles.valorBloco}>
                <Image
                  source={require('../../assets/images/salario.png')}
                  style={styles.iconeSalario}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.valorLabel}>Salário</Text>
                  <Text style={styles.valorTexto}>{vaga.salario}</Text>
                </View>
              </View>
              <View style={styles.divisorVertical} />
              <View style={styles.valorBloco}>
                <Image
                  source={require('../../assets/images/cargahoraria.png')}
                  style={styles.iconeCarga}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.valorLabel}>Carga horária</Text>
                  <Text style={styles.valorTexto}>{vaga.carga}</Text>
                </View>
              </View>
            </View>

            {/* View envolvendo o botão, só para garantir a centralização */}
            <View style={styles.botaoWrapper}>
              <BotaoAnimado style={styles.botao} onPress={() => router.push('/candidatar')}>
                <Text style={styles.txtBotao}>Candidatar-se</Text>
              </BotaoAnimado>
            </View>
          </View>
        </ScrollView>

        {/* Botão de voltar: círculo roxo com sombra e ícone PNG por cima */}
        <BotaoAnimado
          style={styles.botaoVoltar}
          onPress={() => router.push('/vagas')}
          hitSlop={10}
        >
          <Image
            source={require('../../assets/images/voltar.png')}
            style={styles.voltarIcone}
            resizeMode="contain"
          />
        </BotaoAnimado></AnimacaoConteudoPagina>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7B2FF7' },

  conteudo: { flexGrow: 1, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 12 },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    justifyContent: 'space-between',
    gap: 10,
  },

  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  txtTag: { color: '#000', fontWeight: 'bold', fontSize: 11 },

  titulo: { fontSize: 22, fontWeight: '800', color: '#000', marginTop: 8 },
  empresa: { fontSize: 14, color: '#000', marginTop: 2 },

  secao: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 6 },

  itemLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 3 },
  bolinha: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#000000', marginTop: 6 },
  itemTexto: { flex: 1, fontSize: 13, color: '#000', lineHeight: 18 },

  caixaInfo: {
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  infoLinha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoTexto: { flex: 1, fontSize: 13, color: '#000' },

  caixaValores: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  valorBloco: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconeSalario: { width: 20, height: 20 },
  iconeCarga: { width: 20, height: 20 },
  valorLabel: { fontSize: 11, color: '#000' },
  valorTexto: { fontSize: 13, fontWeight: 'bold', color: '#000' },
  divisorVertical: { width: 1, height: 32, backgroundColor: '#D9D9D9', marginHorizontal: 8 },

  botaoWrapper: { alignItems: 'center' },
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7C32E',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 60,
  },
  txtBotao: { fontSize: 17, fontWeight: 'bold', color: '#000' },

  // círculo roxo com sombra (um pouco maior que o ícone)
  botaoVoltar: {
    position: 'absolute',
    bottom: 50,
    left: 6,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F7C32E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // sombra no iOS
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8, // sombra no Android
  },
  // ícone maior (antes 40x40)
  voltarIcone: { width: 48, height: 48 },
});