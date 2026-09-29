import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Cursos() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Tela de cursos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
});
