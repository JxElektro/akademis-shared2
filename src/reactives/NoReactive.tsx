// src/shared-components/reactives/reactivesFiles/NoReactive.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const NoReactive: React.FC = () => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <FontAwesome name="exclamation-circle" size={24} color="red" />

        <Text style={styles.title}>No hay reactivo seleccionado</Text>
        <Text style={styles.message}>
          Aún no has creado una pregunta. Completa la información requerida en el formulario para construir tu pregunta y visualizarla aquí.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2870',
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
});

export default NoReactive;
