import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CardFilme() {
  return (
    <View style={styles.card}>
      <Text style={styles.texto}>Card de filme</Text>
    </View>
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
