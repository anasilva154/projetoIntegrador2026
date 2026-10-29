import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../../components/header';
import { Botao } from '../../../components/botao';
import { RodapeFlutuante } from '../../../components/rodapeperfil';
import { AnimacaoConteudoPagina } from '../../../components/animacaoConteudoPagina';


export default function Inicio() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const larguraBotao = Math.min(width - 48, 320);

  return (
    <View style={styles.tela}>
      <Header />


        <AnimacaoConteudoPagina>{/* Circulos decorativos dentro dos limites da tela */}
        <View style={styles.circuloPequeno} />
        <View style={styles.circuloMedio} />
        <View style={styles.circuloGrande} />

        <ScrollView
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          {/* Texto aninhado com estilos mistos */}
          <Text style={styles.paragrafo}>
            A plataforma que reúne{' '}
            <Text style={styles.destaqueAmarelo}>diferentes oportunidades</Text>{' '}
            em um só lugar,{' '}
            <Text style={styles.destaqueNegrito}>facilitando a busca</Text>{' '}
            por aquilo que combina com os interesses e objetivos de cada pessoa.
          </Text>

          <View style={styles.botoes}>
            <Botao
              titulo="vagas de emprego"
              cor="#F2BE35"
              onPress={() => router.push('/vagas')}
              size={larguraBotao}
            />
            <Botao
              titulo="cursos"
              cor="#5714c4"
              onPress={() => router.push('/cursos')}
              size={larguraBotao}
            />
          </View>

          <View style={styles.rodapeInfo}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#F2BE35" />
            <Text style={styles.textoRodape}>
              Seus envios ficam reunidos e fáceis de consultar.
            </Text>
          </View>
        </ScrollView></AnimacaoConteudoPagina>
        <RodapeFlutuante
          abaAtiva="inicio"
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
    overflow: 'hidden', // corta as formas que ultrapassam a tela
  },
  conteudo: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 110,
    paddingBottom: 100,
  },
  paragrafo: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  destaqueAmarelo: {
    color: '#F2BE35',
    fontWeight: 'bold',
  },
  destaqueNegrito: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  botoes: {
    marginTop: 50,
    gap: 24,
    alignItems: 'center',
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

  // ---------- circulos decorativos ----------

  circuloPequeno: {
    position: 'absolute',
    left: 28,
    bottom: 38,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2BE35',
  },
  circuloMedio: {
    position: 'absolute',
    right: 26,
    bottom: 52,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F2BE35',
  },
  circuloGrande: {
    position: 'absolute',
    left: 117,
    bottom: 28,
    width: 158,
    height: 158,
    borderRadius: 84,
    backgroundColor: '#F2BE35',
  },
});

