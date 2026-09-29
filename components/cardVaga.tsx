import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type Vaga = {
  id: string;
  titulo: string;
  empresa: string;
  atividades: string[];
};

type Props = { vaga: Vaga };

export function CardVaga({ vaga }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.linhaTitulo}>
        <Text style={styles.titulo}>• {vaga.titulo}</Text>
      </View>
      <Text style={styles.empresa}>{vaga.empresa}</Text>

      <View style={styles.caixa}>
        {vaga.atividades.map((atividade, index) => (
          <Text key={index} style={styles.atividade}>
            • {atividade}
          </Text>
        ))}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            // aqui você pode navegar para os detalhes da vaga
          }}
        >
          <Text style={styles.saibaMais}>Saiba mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 4 },
  },
  linhaTitulo: { flexDirection: 'row' },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
  },
  empresa: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  caixa: {
    backgroundColor: '#E8E8E8',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  atividade: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 18,
  },
  saibaMais: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
