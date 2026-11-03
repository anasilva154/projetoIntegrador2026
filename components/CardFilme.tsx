import { ContainerAnimado } from './entradaAnimada';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function CardFilme() {
  return (
    <ContainerAnimado style={styles.card}>
      <Text style={styles.texto}>Card de filme</Text>
    </ContainerAnimado>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  texto: {
    color: '#FFFFFF',
  },
});
