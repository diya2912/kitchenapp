import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function PreferencesScreen({ navigation }) {
  const [cookingTime, setCookingTime] = useState('');
  const [weight, setWeight] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [calories, setCalories] = useState('');

  const fetchRandomRecipes = async (count) => {
    const recipePromises = [];
    for (let i = 0; i < count; i++) {
      recipePromises.push(axios.get('https://www.themealdb.com/api/json/v1/1/random.php'));
    }
    const responses = await Promise.all(recipePromises);
    return responses.map(response => response.data.meals[0]);
  };

  const savePreferences = async () => {
    try {
      // Fetch 5 random recipes from TheMealDB API
      const randomRecipes = await fetchRandomRecipes(5);

      // Pass the random recipes and preferences to the RandomRecipeScreen
      navigation.navigate('RandomRecipe', {
        recipes: randomRecipes,
        preferences: {
          cookingTime,
          weight,
          difficulty,
          calories,
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch random recipes. Please try again.');
      console.error('Error fetching random recipes:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Preferences</Text>

      <TextInput
        style={styles.input}
        placeholder="Cooking Time (in minutes)"
        value={cookingTime}
        onChangeText={setCookingTime}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (in grams)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Difficulty Level (easy, medium, hard)"
        value={difficulty}
        onChangeText={setDifficulty}
      />

      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={savePreferences}>
        <Text style={styles.buttonText}>Save Preferences</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#8fbc8f',
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
