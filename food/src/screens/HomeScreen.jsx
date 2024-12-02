import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/main.png')} style={styles.logo} />
      <Text style={styles.title}>Kitchen Genie</Text>
      <Text style={styles.subtitle}>Home Kitchen</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.buttonText}>Begin Your Journey</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExploreRecipes')}>
        <Text style={styles.buttonText}>Explore Recipes</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PreferencesScreen')}>
        <Text style={styles.buttonText}>Set your Prefences</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#8fbc8f',
    padding: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
