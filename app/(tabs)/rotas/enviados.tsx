import { TouchableOpacityComEfeito as TouchableOpacity } from '../../../components/botaoInterativo';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../../components/header';
import { BotaoVoltar } from '../../botaoVoltar';
import { AnimacaoConteudoPagina } from '../../../components/animacaoConteudoPagina';


export default function Enviados() {
  const router = useRouter();

  return (
    <View style={styles.tela}>
      <Header />


        <AnimacaoConteudoPagina><View pointerEvents="none" style={styles.decoracao}>
          <View style={styles.circuloGrande} />
          <View style={styles.circuloPequeno} />
          <View style={styles.pontoDecorativo} />
        </View>

        <ScrollView
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introducao}>
            <View style={styles.selo}>
              <Ionicons name="folder-open" size={15} color="#F2BE35" />
              <Text style={styles.seloTexto}>SEU ESPAÇO</Text>
            </View>

            <Text style={styles.titulo}>Seus envios</Text>
            <Text style={styles.paragrafo}>
              Tudo o que você enviou, organizado em um só lugar.
            </Text>
          </View>

          <View style={styles.lista}>
            <TouchableOpacity
              style={styles.cartao}
              activeOpacity={0.85}
              onPress={() => router.push('/matriculas')}
            >
              <View style={[styles.iconeContainer, styles.iconeMatriculas]}>
                <Ionicons name="school-outline" size={27} color="#7B2FF7" />
              </View>

              <View style={styles.detalhesCartao}>
                <Text style={styles.etiqueta}>EDUCAÇÃO</Text>
                <Text style={styles.tituloCartao}>Matrículas</Text>
                <Text style={styles.descricaoCartao}>
                  Consulte suas solicitações de matrícula.
                </Text>
              </View>

              <View style={styles.seta}>
                <Ionicons name="arrow-forward" size={19} color="#7B2FF7" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cartao}
              activeOpacity={0.85}
              onPress={() => router.push('/curriculos')}
            >
              <View style={[styles.iconeContainer, styles.iconeCurriculos]}>
                <Ionicons name="document-text-outline" size={27} color="#8B5A00" />
              </View>

              <View style={styles.detalhesCartao}>
                <Text style={styles.etiqueta}>OPORTUNIDADES</Text>
                <Text style={styles.tituloCartao}>Currículos</Text>
                <Text style={styles.descricaoCartao}>
                  Acompanhe os currículos que você enviou.
                </Text>
              </View>

              <View style={styles.seta}>
                <Ionicons name="arrow-forward" size={19} color="#7B2FF7" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.ajuda}>
            <Ionicons name="information-circle-outline" size={20} color="#F2BE35" />
            <Text style={styles.ajudaTexto}>
              Toque em uma categoria para ver os detalhes dos seus envios.
            </Text>
          </View>
        </ScrollView>

        <BotaoVoltar /></AnimacaoConteudoPagina>

    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#7B2FF7',
  },
  decoracao: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circuloGrande: {
    position: 'absolute',
    top: 140,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
  circuloPequeno: {
    position: 'absolute',
    top: 310,
    right: 28,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(242,190,53,0.75)',
  },
  pontoDecorativo: {
    position: 'absolute',
    top: 350,
    right: 62,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 112,
  },
  introducao: {
    marginBottom: 28,
  },
  selo: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  seloTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: 18,
  },
  paragrafo: {
    maxWidth: 300,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  lista: {
    gap: 16,
  },
  cartao: {
    minHeight: 142,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    elevation: 7,
    shadowColor: '#7B2FF7',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
  },
  iconeContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  iconeMatriculas: {
    backgroundColor: '#F8F8F8',
  },
  iconeCurriculos: {
    backgroundColor: '#FFF3D6',
  },
  detalhesCartao: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  etiqueta: {
    color: '#7B2FF7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  tituloCartao: {
    color: '#7B2FF7',
    fontSize: 20,
    fontWeight: '800',
  },
  descricaoCartao: {
    color: '#7B2FF7',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },
  seta: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ajuda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  ajudaTexto: {
    flex: 1,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 19,
  },
});
