import { ContainerAnimado } from '../../components/entradaAnimada';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProtegerRota } from '../rotaServidor/usuarioController';

const cores = {
  fundo: '#7B2FF7',
  escuro: '#7B2FF7',
  texto: '#7B2FF7',
  amarelo: '#FFD22E',
  branco: '#FFFFFF',
  cinza: '#FFFFFF',
  cinzaCard: '#FFFFFF',
  vermelho: '#FF5A5F',
};

type CandidatoDetalhes = {
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  bairro: string;
  curriculo: {
    nome: string;
    detalhe: string;
    url: string;
  };
};

const candidatoPadrao: CandidatoDetalhes = {
  nome: 'Ana Silva',
  email: 'cliente@vooa.com',
  telefone: '(48) 99999-1234',
  idade: '18 anos',
  bairro: 'Centro',
  curriculo: {
    nome: 'Curriculo_Ana_Silva.pdf',
    detalhe: 'Arquivo enviado pelo candidato',
    url: '',
  },
};

function lerCandidato(valor: string | string[] | undefined): CandidatoDetalhes | null {
  if (typeof valor !== 'string') return null;

  try {
    return JSON.parse(valor) as CandidatoDetalhes;
  } catch {
    return null;
  }
}

export default function PdfCurriculoScreen() {
  const router = useRouter();
  const { usuario } = useProtegerRota('empresa');
  const params = useLocalSearchParams<{ candidato?: string }>();
  const candidato = lerCandidato(params.candidato) ?? candidatoPadrao;

  if (!usuario) return null;

  const dadosCandidato: {
    rotulo: string;
    valor: string;
    icone: keyof typeof Ionicons.glyphMap;
  }[] = [
    { rotulo: 'Nome completo', valor: candidato.nome, icone: 'person' },
    { rotulo: 'E-mail', valor: candidato.email, icone: 'mail' },
    { rotulo: 'Telefone', valor: candidato.telefone, icone: 'call' },
    { rotulo: 'Idade', valor: candidato.idade, icone: 'calendar' },
    { rotulo: 'Bairro', valor: candidato.bairro, icone: 'location' },
  ];

  async function abrirCurriculo() {
    if (!candidato.curriculo.url) {
      Alert.alert('Arquivo salvo localmente', `Arquivo anexado: ${candidato.curriculo.nome}`);
      return;
    }

    try {
      await Linking.openURL(candidato.curriculo.url);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o currículo.');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudoScroll}>
        <Text style={styles.titulo}>Currículo</Text>
        <Text style={styles.subtitulo}>
          Confira o arquivo enviado pelo candidato.
        </Text>

        <ContainerAnimado staggerIndex={0} style={styles.cardDados}>
          {dadosCandidato.map((item, index) => (
            <View key={item.rotulo}>
              {index > 0 && <View style={styles.divisor} />}
              <View style={styles.campo}>
                <Ionicons name={item.icone} size={22} color={cores.fundo} />
                <View style={styles.campoTextos}>
                  <Text style={styles.rotulo}>{item.rotulo}</Text>
                  <Text style={styles.valor}>{item.valor}</Text>
                </View>
              </View>
            </View>
          ))}
        </ContainerAnimado>

        <ContainerAnimado staggerIndex={1}>
          <Pressable style={styles.cardArquivo} onPress={abrirCurriculo}>
            <View style={styles.pdfIcone}>
              <Text style={styles.pdfIconeTexto}>PDF</Text>
            </View>
            <View style={styles.arquivoInfo}>
              <Text style={styles.arquivoNome} numberOfLines={1}>
                {candidato.curriculo.nome}
              </Text>
              <Text style={styles.arquivoDetalhe}>
                {candidato.curriculo.detalhe}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={cores.escuro} />
          </Pressable>
        </ContainerAnimado>
      </ScrollView>

      <Pressable
        style={styles.botaoVoltar}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        hitSlop={10}
      >
        <Image
          source={require('../../assets/voltar 1.png')}
          style={styles.voltarIcone}
          resizeMode="contain"
          accessibilityLabel="Seta para voltar"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  conteudoScroll: { flexGrow: 1, paddingTop: 12 },
  titulo: { fontSize: 24, fontWeight: '800', color: cores.branco },
  subtitulo: { fontSize: 15, color: cores.branco, marginTop: 2, marginBottom: 16 },
  cardArquivo: {
    backgroundColor: cores.branco,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
  },
  pdfIcone: {
    width: 44,
    height: 54,
    borderRadius: 8,
    backgroundColor: cores.vermelho,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  pdfIconeTexto: { color: cores.branco, fontSize: 13, fontWeight: '800' },
  arquivoInfo: { flex: 1, gap: 4 },
  arquivoNome: { fontSize: 16, fontWeight: '800', color: '#000000' },
  arquivoDetalhe: { fontSize: 13, color: cores.texto },
  cardDados: {
    backgroundColor: cores.cinzaCard,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  campoTextos: { flex: 1 },
  rotulo: { color: '#777777', fontSize: 12 },
  valor: { color: '#333333', fontSize: 16, fontWeight: '500' },
  divisor: { height: 1, backgroundColor: '#D6D6D6' },
  botaoVoltar: {
    position: 'absolute',
    bottom: 82,
    left: 6,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.amarelo,
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
