import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AbaRodape = 'inicio' | 'editar' | 'perfil';

type RodapeFlutuanteProps = {
  abaAtiva: AbaRodape;
  aoIrParaInicio: () => void;
  aoAdicionar: () => void;
  aoIrParaPerfil: () => void;
};

const ABAS: {
  id: AbaRodape;
  imagem: number;
  rotulo: string;
}[] = [
  {
    id: 'inicio',
    imagem: require('../assets/images/inicio.png'),
    rotulo: 'Início',
  },
  {
    id: 'editar',
    imagem: require('../assets/images/editar.png'),
    rotulo: 'Adicionar vaga ou curso',
  },
  {
    id: 'perfil',
    imagem: require('../assets/images/inicioperfil.png'),
    rotulo: 'Perfil da empresa',
  },
];

export function RodapeFlutuante({
  abaAtiva,
  aoIrParaInicio,
  aoAdicionar,
  aoIrParaPerfil,
}: RodapeFlutuanteProps) {
  const insets = useSafeAreaInsets();
  const acoes = {
    inicio: aoIrParaInicio,
    editar: aoAdicionar,
    perfil: aoIrParaPerfil,
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.posicionamento, { paddingBottom: insets.bottom + 12 }]}
    >
      <View style={styles.barra}>
        {ABAS.map((aba) => {
          const ativa = abaAtiva === aba.id;
          return (
            <Pressable
              key={aba.id}
              style={styles.botao}
              onPress={acoes[aba.id]}
              accessibilityRole="button"
              accessibilityLabel={aba.rotulo}
              accessibilityState={{ selected: ativa }}
              hitSlop={8}
            >
              <Image source={aba.imagem} style={styles.icone} resizeMode="contain" />
              <View style={[styles.indicador, ativa && styles.indicadorAtivo]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  posicionamento: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  barra: {
    width: '92%',
    maxWidth: 440,
    height: 66,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(242,242,242,0.62)',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.42)',
    shadowColor: '#25164F',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  botao: {
    width: 58,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    width: 24,
    height: 24,
  },
  indicador: {
    width: 14,
    height: 3,
    marginTop: 5,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicadorAtivo: {
    backgroundColor: '#7B2FF7',
  },
});
