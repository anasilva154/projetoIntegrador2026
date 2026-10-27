import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/header';
import { RodapeFlutuante } from '../components/rodapeperfil';

export default function Curriculos() {
  const router = useRouter();

  return (
    <View style={styles.tela}>
      <Header />

      <View pointerEvents="none" style={styles.decoracao}>
        <View style={styles.circuloGrande} />
        <View style={styles.circuloPequeno} />
        <View style={styles.pontoDecorativo} />
      </View>

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.selo}>
          <Ionicons name="briefcase-outline" size={15} color="#F2BE35" />
          <Text style={styles.seloTexto}>NOVOS CAMINHOS PROFISSIONAIS</Text>
        </View>

        <Text style={styles.titulo}>Currículos</Text>
        <Text style={styles.subtitulo}>
          Tenha seus envios para oportunidades de trabalho sempre à mão.
        </Text>

        <View style={styles.cartaoVazio}>
          <View style={styles.iconePrincipal}>
            <Ionicons name="document-text" size={35} color="#8B5A00" />
            <View style={styles.iconeSelo}>
              <Ionicons name="checkmark" size={15} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.etiquetaStatus}>
            <View style={styles.pontoStatus} />
            <Text style={styles.etiquetaStatusTexto}>SEUS CURRÍCULOS</Text>
          </View>

          <Text style={styles.tituloCartao}>Sua próxima oportunidade espera</Text>
          <Text style={styles.textoCartao}>
            Depois de enviar um currículo, você poderá consultar seus envios e
            acompanhar suas oportunidades nesta página.
          </Text>

          <View style={styles.divisor} />

          <View style={styles.dica}>
            <Ionicons name="sparkles-outline" size={20} color="#8A5B00" />
            <Text style={styles.dicaTexto}>
              Mantenha seu currículo atualizado para apresentar o melhor de você.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoAcao}
            activeOpacity={0.85}
            onPress={() => router.push('/vagas')}
          >
            <Ionicons name="search-outline" size={19} color="#FFFFFF" />
            <Text style={styles.textoBotao}>Ver oportunidades</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.rodapeInfo}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#F2BE35" />
          <Text style={styles.textoRodape}>
            Seus envios ficam reunidos e fáceis de consultar.
          </Text>
        </View>
      </ScrollView>

      <RodapeFlutuante
        abaAtiva="editar"
        aoIrParaInicio={() => router.push('/rotas/inicialpessoa')}
        aoAdicionar={() => router.push('/curriculos')}
        aoIrParaPerfil={() => router.push('/perfil')}
      />
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
    top: 150,
    right: -105,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
  circuloPequeno: {
    position: 'absolute',
    top: 330,
    right: 28,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: 'rgba(242,190,53,0.75)',
  },
  pontoDecorativo: {
    position: 'absolute',
    top: 365,
    right: 65,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 112,
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
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: 18,
  },
  subtitulo: {
    maxWidth: 310,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 26,
  },
  cartaoVazio: {
    alignItems: 'center',
    padding: 22,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    elevation: 7,
    shadowColor: '#7B2FF7',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
  },
  iconePrincipal: {
    position: 'relative',
    width: 76,
    height: 76,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3D6',
    marginBottom: 18,
  },
  iconeSelo: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B2FF7',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  etiquetaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#FFF7E5',
  },
  pontoStatus: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D69A16',
  },
  etiquetaStatusTexto: {
    color: '#8A5B00',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  tituloCartao: {
    color: '#7B2FF7',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 16,
  },
  textoCartao: {
    color: '#7B2FF7',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  divisor: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 19,
  },
  dica: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 13,
    borderRadius: 16,
    backgroundColor: '#FFF7E5',
  },
  dicaTexto: {
    flex: 1,
    color: '#69572D',
    fontSize: 13,
    lineHeight: 19,
  },
  botaoAcao: {
    alignSelf: 'stretch',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#7B2FF7',
    marginTop: 17,
  },
  textoBotao: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  rodapeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 21,
    paddingHorizontal: 6,
  },
  textoRodape: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    lineHeight: 18,
  },
});
