// screens/RecipeSuggestionsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const RecipeSuggestionsScreen = ({ navigation }) => { // Accept navigation prop
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch random recipes when the component mounts
  useEffect(() => {
    const fetchMultipleRandomRecipes = async () => {
      const randomRecipes = [];
      for (let i = 0; i < 5; i++) { // Fetch 5 random recipes
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        if (response.data && response.data.meals) {
          randomRecipes.push(response.data.meals[0]); // Add the meal to the array
        }
      }
      setRecipes(randomRecipes);
      setLoading(false);
    };

    fetchMultipleRandomRecipes();
  }, []); // Empty dependency array to fetch once when the component mounts

  const renderRecipeItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.recipeItem}
        onPress={() => navigation.navigate('RecipeInstructionsScreen', { recipe: item })} // Navigate to the RecipeInstructionsScreen with recipe data
      >
        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
        <Text style={styles.recipeTitle}>{item.strMeal}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4B7B3E" style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommended Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.idMeal} // Use idMeal for unique key
        contentContainerStyle={styles.recipeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f7c3',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B7B3E',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeList: {
    paddingBottom: 20,
  },
  recipeItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4B7B3E',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B7B3E',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default RecipeSuggestionsScreen;
