import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/header';
import { RodapeFlutuante } from '../components/rodapeperfil';
import { listarEnvios, type Envio } from './rotaServidor/envios';

type FiltroEnvios = 'todos' | 'vaga' | 'curso';
const corAmarelaDestaque = '#FFC83D';

const opcoesFiltro: { valor: FiltroEnvios; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'vaga', rotulo: 'Currículos' },
  { valor: 'curso', rotulo: 'Cursos' },
];

function formatarData(data: string) {
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return 'Data indisponível';
  return valor.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Curriculos() {
  const router = useRouter();
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [filtro, setFiltro] = useState<FiltroEnvios>('todos');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const telaEmFoco = useIsFocused();

  useEffect(() => {
    if (!telaEmFoco) return;

    let ativo = true;

    async function carregarEnvios() {
      setCarregando(true);
      setErro('');

      try {
        const resultado = await listarEnvios();
        if (ativo) setEnvios(resultado);
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar seus envios.',
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregarEnvios();
    return () => {
      ativo = false;
    };
  }, [telaEmFoco, tentativa]);

  const enviosFiltrados = useMemo(
    () => envios.filter((envio) => filtro === 'todos' || envio.tipo === filtro),
    [envios, filtro],
  );

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
        <Text style={styles.titulo}>Meus envios</Text>
        <Text style={styles.subtitulo}>
          Consulte os currículos e as matrículas que você já enviou.
        </Text>

        <View style={styles.filtros}>
          {opcoesFiltro.map((opcao) => {
            const ativo = filtro === opcao.valor;
            return (
              <Pressable
                key={opcao.valor}
                style={[styles.filtro, ativo && styles.filtroAtivo]}
                onPress={() => setFiltro(opcao.valor)}
                accessibilityRole="button"
                accessibilityState={{ selected: ativo }}
              >
                <Text style={[styles.filtroTexto, ativo && styles.filtroTextoAtivo]}>
                  {opcao.rotulo}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {carregando ? (
          <ActivityIndicator style={styles.estado} color="#FFFFFF" />
        ) : erro ? (
          <View style={styles.estadoCartao}>
            <Ionicons name="alert-circle-outline" size={30} color="#D93025" />
            <Text style={styles.estadoTexto}>{erro}</Text>
            <Pressable style={styles.botaoRecarregar} onPress={() => setTentativa((valor) => valor + 1)}>
              <Text style={styles.botaoRecarregarTexto}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : enviosFiltrados.length === 0 ? (
          <View style={styles.estadoCartao}>
            <Ionicons
              name={filtro === 'curso' ? 'school-outline' : 'document-text-outline'}
              size={34}
              color="#000000"
            />
            <Text style={styles.estadoTitulo}>
              {envios.length === 0
                ? 'Você ainda não enviou nada'
                : 'Nenhum envio nesta categoria'}
            </Text>
            <Text style={styles.estadoTexto}>
              {envios.length === 0
                ? 'Quando enviar um currículo ou solicitar uma matrícula, ele aparecerá aqui.'
                : 'Escolha outro filtro para consultar seus envios.'}
            </Text>
            {envios.length === 0 && (
              <Pressable
                style={styles.botaoAcao}
                onPress={() => router.push(filtro === 'curso' ? '/cursos' : '/vagas')}
              >
                <Ionicons name="search-outline" size={19} color="#25164F" />
                <Text style={styles.textoBotao}>
                  {filtro === 'curso' ? 'Ver cursos' : 'Ver oportunidades'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#25164F" />
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.listaEnvios}>
            {enviosFiltrados.map((envio) => (
              <Pressable
                key={envio.id}
                style={styles.cartaoEnvio}
                onPress={() =>
                  router.push({
                    pathname: '/rotas/envios/[id]',
                    params: { id: String(envio.id), dados: JSON.stringify(envio) },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Ver ${envio.tipo === 'curso' ? 'matrícula' : 'currículo'} para ${envio.titulo}`}
              >
                <View style={styles.iconeEnvio}>
                  <Ionicons
                    name={envio.tipo === 'curso' ? 'school-outline' : 'document-text-outline'}
                    size={25}
                    color="#8B5A00"
                  />
                </View>
                <View style={styles.detalhesEnvio}>
                  <Text style={styles.etiquetaEnvio}>
                    {envio.tipo === 'curso' ? 'MATRÍCULA' : 'CURRÍCULO'}
                  </Text>
                  <Text style={styles.tituloEnvio} numberOfLines={2}>
                    {envio.titulo}
                  </Text>
                  <Text style={styles.metaEnvio}>
                    {envio.empresa}{envio.nome ? ` · ${envio.nome}` : ''}
                  </Text>
                  <Text style={styles.metaEnvio}>
                    Enviado em {formatarData(envio.data_envio)}
                    {envio.arquivo_nome ? ` · ${envio.arquivo_nome}` : ''}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#333333" />
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.rodapeInfo}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#F2BE35" />
          <Text style={styles.textoRodape}>
            Seus envios são armazenados neste aparelho.
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
  titulo: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: 0,
  },
  subtitulo: {
    maxWidth: 310,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 20,
  },
  filtros: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  filtro: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  filtroAtivo: {
    backgroundColor: corAmarelaDestaque,
  },
  filtroTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  filtroTextoAtivo: {
    color: '#25164F',
  },
  listaEnvios: {
    gap: 12,
  },
  cartaoEnvio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#25164F',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  iconeEnvio: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3D6',
  },
  detalhesEnvio: {
    flex: 1,
    gap: 3,
  },
  etiquetaEnvio: {
    color: '#8A5B00',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tituloEnvio: {
    color: '#25164F',
    fontSize: 16,
    fontWeight: '800',
  },
  metaEnvio: {
    color: '#6B6B80',
    fontSize: 12,
    lineHeight: 17,
  },
  estado: {
    marginTop: 30,
    marginBottom: 30,
  },
  estadoCartao: {
    alignItems: 'center',
    gap: 10,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  estadoTitulo: {
    color: '#000000',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  estadoTexto: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  botaoRecarregar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#7B2FF7',
  },
  botaoRecarregarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
    backgroundColor: corAmarelaDestaque,
    marginTop: 17,
  },
  textoBotao: {
    flex: 1,
    color: '#25164F',
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
