// screens/RecipeInstructionsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const RecipeInstructionsScreen = ({ route }) => {
  const { recipe } = route.params; // Get the recipe data passed from RecipeSuggestionsScreen

  // Get ingredients from the recipe object
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.instructionsTitle}>Ingredients:</Text>
      {ingredients.length > 0 ? (
        ingredients.map((item, index) => (
          <Text key={index} style={styles.ingredient}>{item}</Text>
        ))
      ) : (
        <Text style={styles.noIngredients}>No ingredients found.</Text>
      )}
      <Text style={styles.instructionsTitle}>Instructions:</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f7c3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#4B7B3E',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B7B3E',
  },
  instructions: {
    fontSize: 16,
    color: '#333',
  },
  ingredient: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noIngredients: {
    fontSize: 16,
    color: '#999',
  },
});

export default RecipeInstructionsScreen;
