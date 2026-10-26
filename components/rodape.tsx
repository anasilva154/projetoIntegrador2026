import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const ABAS = [
  { rotulo: 'Início', rota: '/', icone: 'home-outline' },
  { rotulo: 'Currículos', rota: '/curriculos', icone: 'document-text-outline' },
  { rotulo: 'Matrículas', rota: '/matriculas', icone: 'school-outline' },
] as const;

export function Rodape() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.rodape}>
      {ABAS.map((aba) => {
        const ativa = pathname === aba.rota;
        return (
          <Pressable
            key={aba.rota}
            style={styles.aba}
            onPress={() => router.push(aba.rota)}
          >
            <Ionicons
              name={aba.icone}
              size={22}
              color={ativa ? '#F2BE35' : '#FFFFFF'}
            />
            <Text style={[styles.rotulo, ativa && styles.rotuloAtivo]}>
              {aba.rotulo}
            </Text>
            {ativa && <View style={styles.indicador} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rodape: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#5A1CC4',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  rotulo: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.7,
  },
  rotuloAtivo: {
    color: '#F2BE35',
    fontWeight: 'bold',
    opacity: 1,
  },
  indicador: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F2BE35',
  },
});