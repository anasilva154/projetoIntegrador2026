import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import DadosVagas from '@/app/rotaServidor/dados';


export default function Vagas() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vagas = DadosVagas();
  const vagaSelecionada = vagas.find((vaga) => vaga.id === id);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      {vagaSelecionada ? (
        <>
          <View style={styles.cabecalho}>
            <Text style={styles.identificador}>OPORTUNIDADE · VAGA {id}</Text>
            <Text style={styles.titulo}>{vagaSelecionada.titulo}</Text>
            <Text style={styles.subtitulo}>Confira os detalhes e as atividades desta oportunidade.</Text>
          </View>

          <View style={styles.cartaoResumo}>
            <View style={styles.itemResumo}>
              <Text style={styles.rotuloResumo}>SALÁRIO</Text>
              <Text style={styles.valorResumo}>{vagaSelecionada.salario}</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.itemResumo}>
              <Text style={styles.rotuloResumo}>IDADE</Text>
              <Text style={styles.valorResumo}>{vagaSelecionada.idade}</Text>
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Sobre a vaga</Text>
            <View style={styles.linhaInfo}>
              <Text style={styles.rotulo}>Carga horária</Text>
              <Text style={styles.valor}>{vagaSelecionada.cargaHoraria}</Text>
            </View>
            <View style={styles.linhaInfo}>
              <Text style={styles.rotulo}>Escolaridade</Text>
              <Text style={styles.valor}>{vagaSelecionada.escolaridade}</Text>
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Atividades</Text>
            {vagaSelecionada.topicos.map((topico, index) => (
              <View key={`${index}-${topico.descricao}`} style={styles.linhaAtividade}>
                <Text style={styles.marcador}>•</Text>
                <Text style={styles.textoAtividade}>{topico.descricao.replace(/^\s*-\s*/, '')}</Text>
              </View>
            ))}
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Requisitos</Text>
            <Text style={styles.valor}>{vagaSelecionada.requisitos}</Text>
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Benefícios</Text>
            <Text style={styles.valor}>{vagaSelecionada.beneficios}</Text>
          </View>
        </>
      ) : (
        <View style={styles.naoEncontrada}>
          <Text style={styles.tituloSecao}>Vaga não encontrada</Text>
          <Text style={styles.valor}>Não há uma oportunidade cadastrada com este identificador.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#7B2CF9' },
  conteudo: { padding: 20, paddingBottom: 40, gap: 14 },
  cabecalho: { paddingTop: 12, paddingBottom: 8 },
  identificador: { color: '#F2BE35', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  titulo: { color: '#ecedea', fontSize: 28, fontWeight: '800', marginTop: 10 },
  subtitulo: { color: '#edebea', fontSize: 15, lineHeight: 22, marginTop: 8 },
  cartaoResumo: {
    backgroundColor: '#F2BE35',
    borderRadius: 8,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemResumo: { flex: 1, gap: 6 },
  rotuloResumo: { color: '#2e2b2b', fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  valorResumo: { color: '#2e2b2b', fontSize: 15, fontWeight: '600', lineHeight: 21 },
  divisor: { width: 1, alignSelf: 'stretch', backgroundColor: '#6D8B7D', marginHorizontal: 16 },
  secao: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 18, gap: 14 },
  tituloSecao: { color: '#183A30', fontSize: 18, fontWeight: '700' },
  linhaInfo: { gap: 4 },
  rotulo: { color: '#F2BE35', fontSize: 13, fontWeight: '600' },
  valor: { color: '#2e2b2b', fontSize: 15, lineHeight: 23 },
  linhaAtividade: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  marcador: { color: '#F2BE35', fontSize: 19, lineHeight: 22 },
  textoAtividade: { color: '#2e2b2b', flex: 1, fontSize: 15, lineHeight: 23 },
  naoEncontrada: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 20, gap: 10, marginTop: 24 },
});