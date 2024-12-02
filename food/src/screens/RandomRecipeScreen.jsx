import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

const RandomRecipeScreen = ({ route }) => {
  const { recipes } = route.params;
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState(null);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);

  // Toggle recipe details
  const toggleRecipeDetails = (index) => {
    setExpandedRecipeIndex(expandedRecipeIndex === index ? null : index);
  };

  // Filter recipes based on vegetarian preference
  const filteredRecipes = showVegetarianOnly
    ? recipes.filter((recipe) =>
        recipe.strTags?.toLowerCase().includes('vegetarian') || 
        recipe.strCategory?.toLowerCase() === 'vegetarian'
      )
    : recipes;

  return (
    <ScrollView style={styles.container}>
      {/* Header with Vegetarian Switch */}
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Recipes</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Vegetarian Only</Text>
          <Switch
            value={showVegetarianOnly}
            onValueChange={setShowVegetarianOnly}
            trackColor={{ false: '#d3d3d3', true: '#4caf50' }}
            thumbColor={showVegetarianOnly ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Display Filtered Recipes */}
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe, index) => (
          <View key={index} style={styles.recipeContainer}>
            <TouchableOpacity onPress={() => toggleRecipeDetails(index)}>
              <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
              <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
            </TouchableOpacity>

            {/* Expandable Recipe Details */}
            {expandedRecipeIndex === index && (
              <View style={styles.recipeDetails}>
                <Text style={styles.subTitle}>Ingredients:</Text>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => {
                  const ingredient = recipe[`strIngredient${i}`];
                  const measure = recipe[`strMeasure${i}`];
                  if (ingredient) {
                    return (
                      <Text key={i} style={styles.ingredientText}>
                        {ingredient} - {measure}
                      </Text>
                    );
                  }
                  return null;
                })}

                <Text style={styles.subTitle}>Instructions:</Text>
                <Text style={styles.instructions}>{recipe.strInstructions}</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noRecipesText}>No recipes found matching your preference.</Text>
      )}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#555',
  },
  recipeContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: '#333',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  recipeDetails: {
    padding: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 14,
    color: '#555',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noRecipesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RandomRecipeScreen;
