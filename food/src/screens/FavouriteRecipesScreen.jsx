// src/screens/FavouriteRecipesScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavouriteRecipesScreen() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteRecipes');
        if (storedFavorites) {
          setFavoriteRecipes(JSON.parse(storedFavorites));
        }
      } catch (err) {
        console.log("Error fetching favorite recipes:", err.message);
      }
    };

    fetchFavoriteRecipes();
  }, []);

  const renderRecipeCard = ({ item }) => (
    <View style={styles.recipeCard}>
      <Image
        source={{ uri: item.strMealThumb }}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTitle}>{item.strMeal}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Recipes</Text>
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderRecipeCard}
        />
      ) : (
        <Text style={styles.noRecipesText}>No favorite recipes added.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7c3",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A9E56',
    marginBottom: 20,
  },
  recipeCard: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    color: '#6A9E56',
  },
  noRecipesText: {
    fontSize: 16,
    color: '#6A9E56',
  },
});
