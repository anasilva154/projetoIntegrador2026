import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/header';
import { Botao } from '../../components/botao';

export default function Inicio() {
  const router = useRouter();

  return (
    <View style={styles.tela}>
      <Header nome="nome do usuario" />

      <View style={styles.conteudo}>
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
          />
          <Botao
            titulo="cursos"
            cor="#6A2BC7"
            onPress={() => router.push('/cursos')}
          />
        </View>
      </View>

      {/* Circulos decorativos dentro dos limites da tela */}
      <View style={styles.circuloPequeno} />
      <View style={styles.circuloMedio} />
      <View style={styles.circuloGrande} />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#7B2CF9',
    overflow: 'hidden', // corta as formas que ultrapassam a tela
  },
  conteudo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingTop: 110,
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
