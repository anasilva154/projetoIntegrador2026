import { ContainerAnimado } from '../../components/entradaAnimada';
// app/(tabs)/vagasinformacao.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useIsFocused } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';

import { Header } from '../../components/header';
import {
  Animated,
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  Pressable,
} from 'react-native';
import { buscarVagaPorId, type VagaItem } from '../rotaServidor/vagasController';
import { useProtegerRota } from '../rotaServidor/usuarioController';

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
  const [escala] = useState(() => new Animated.Value(1));

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
  const { usuario } = useProtegerRota('cliente');
  const params = useLocalSearchParams<{ id?: string }>();
  const telaEmFoco = useIsFocused();
  const [vaga, setVaga] = useState<VagaItem | null>(null);

  useEffect(() => {
    if (!telaEmFoco || !usuario) return;

    async function carregar() {
      const encontrada = await buscarVagaPorId(params.id);
      setVaga(encontrada);
    }

    carregar();
  }, [telaEmFoco, usuario, params.id]);

  if (!usuario || !vaga) return null;

  const listaSobre = (vaga.topicos || []).map((t) =>
    t.descricao.replace(/^\s*-\s*/, '')
  );

  const listaRequisitos = (vaga.requisitos || '')
    .split(/\n|;/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const localFormatado = `${vaga.cidade || 'Criciúma - SC'} · ${
    vaga.presencial === false ? 'Não presencial' : 'Presencial'
  }`;

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <ContainerAnimado style={styles.card}>
          <View>
            <View style={styles.tag}>
              <Text style={styles.txtTag}>VAGA</Text>
            </View>
            <Text style={styles.titulo}>{vaga.titulo}</Text>
            <Text style={styles.empresa}>{vaga.empresa}</Text>
          </View>

          <View>
            <Text style={styles.secao}>Sobre a vaga</Text>
            <Lista
              itens={
                listaSobre.length > 0
                  ? listaSobre
                  : ['Atividades conforme orientação da empresa.']
              }
            />
          </View>

          <View style={styles.caixaInfo}>
            <View style={styles.infoLinha}>
              <Ionicons name="location-outline" size={18} color="#000" />
              <Text style={styles.infoTexto}>{localFormatado}</Text>
            </View>
            <View style={styles.infoLinha}>
              <Ionicons name="briefcase-outline" size={18} color="#000" />
              <Text style={styles.infoTexto}>{vaga.categoria || 'Geral'}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.secao}>Requisitos</Text>
            <Lista
              itens={
                listaRequisitos.length > 0 ? listaRequisitos : ['Não informado']
              }
            />
          </View>

          <View style={styles.caixaValores}>
            <View style={styles.valorBloco}>
              <Image
                source={require('../../assets/images/salario.png')}
                style={styles.iconeSalario}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.valorLabel}>Salário</Text>
                <Text style={styles.valorTexto}>{vaga.salario || 'A combinar'}</Text>
              </View>
            </View>
            <View style={styles.divisorVertical} />
            <View style={styles.valorBloco}>
              <Image
                source={require('../../assets/images/cargahoraria.png')}
                style={styles.iconeCarga}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.valorLabel}>Carga horária</Text>
                <Text style={styles.valorTexto}>
                  {(vaga.cargaHoraria || 'A combinar').split('/')[0].trim()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.botaoWrapper}>
            <BotaoAnimado
              style={styles.botao}
              onPress={() =>
                router.push({
                  pathname: '/candidatar',
                  params: {
                    vagaId: vaga.id,
                    titulo: vaga.titulo,
                    empresa: vaga.empresa,
                    area: vaga.categoria,
                  },
                })
              }
            >
              <Text style={styles.txtBotao}>Candidatar-se</Text>
            </BotaoAnimado>
          </View>
        </ContainerAnimado>
      </ScrollView>

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
      </BotaoAnimado>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7B2FF7' },
  conteudo: { flexGrow: 1, paddingHorizontal: 12, paddingTop: 38, paddingBottom: 12 },
  card: {
    minHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    justifyContent: 'flex-start',
    gap: 23,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingTop: 6,
    paddingBottom: 3,
  },
  txtTag: { color: '#D99A00', fontWeight: 'bold', fontSize: 13 },
  titulo: { fontSize: 22, fontWeight: '800', color: '#7B2FF7', marginTop: 8 },
  empresa: { fontSize: 14, color: '#D99A00', marginTop: 2 },
  secao: { fontSize: 16, fontWeight: 'bold', color: '#7B2FF7', marginBottom: 6 },
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
    alignItems: 'flex-start',
  },
  valorBloco: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconeSalario: { width: 20, height: 20, tintColor: '#000000' },
  iconeCarga: { marginTop: 3,width: 20, height: 20, tintColor: '#000000' },
  valorLabel: { fontSize: 11, color: '#D99A00' },
  valorTexto: { fontSize: 13, fontWeight: 'normal', color: '#000' },
  divisorVertical: { width: 1, height: 32, backgroundColor: '#D9D9D9', marginHorizontal: 8 },
  botaoWrapper: { alignItems: 'center', marginTop: 18 },
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7C32E',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 60,
  },
  txtBotao: { fontSize: 17, fontWeight: 'bold', color: '#000' },
  botaoVoltar: {
    position: 'absolute',
    bottom: 32,
    left: 6,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F7C32E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  voltarIcone: { width: 48, height: 48 },
});
