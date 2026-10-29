import { PressableComEfeito as Pressable } from './botaoInterativo';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ABAS = [
  { rotulo: 'Início', rota: '/', imagem: require('../assets/images/inicio.png') },
  {
    rotulo: 'Currículos enviados',
    rota: '/curriculos',
    imagem: require('../assets/images/envelope.png'),
  },
  { rotulo: 'Perfil', rota: '/perfil', imagem: require('../assets/images/iconeperfil.png') },
] as const;

export function Rodape() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.posicionamento, { paddingBottom: insets.bottom + 12 }]}
    >
      <View style={styles.rodape}>
        {ABAS.map((aba) => {
          const ativa = pathname === aba.rota;
          return (
            <Pressable
              key={aba.rota}
              style={styles.aba}
              onPress={() => router.push(aba.rota)}
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
  rodape: {
    width: '92%',
    maxWidth: 440,
    height: 66,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(242,242,242,0.62)',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.42)',
    shadowColor: '#7B2FF7',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  aba: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icone: {
    width: 24,
    height: 24,
  },
  indicador: {
    width: 14,
    height: 3,
    marginTop: 1,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicadorAtivo: { backgroundColor: '#7B2FF7' },
});
