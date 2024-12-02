// src/screens/HighestRatingRecipeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import RatingComponent from "../components/RatingComponent";

export default function HighestRatingRecipeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchHighestRatedRecipes();
  }, []);

  const fetchHighestRatedRecipes = async () => {
    try {
      const response = await axios.get(
        "https://themealdb.com/api/json/v1/1/search.php?s="
      );
      if (response && response.data && response.data.meals) {
        // Assume we have a rating attribute here, or mock it for demo purposes
        const ratedRecipes = response.data.meals.map(recipe => ({
          ...recipe,
          rating: Math.floor(Math.random() * 5) + 1 // Mock rating
        }));
        ratedRecipes.sort((a, b) => b.rating - a.rating); // Sort by highest rating
        setRecipes(ratedRecipes);
      }
    } catch (error) {
      console.log("Error fetching recipes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipeId) => {
    navigation.navigate("RecipeDetails", { recipeId });
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleRecipePress(item.idMeal)}>
      <View style={styles.recipeCard}>
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.recipeImage}
        />
        <Text style={styles.recipeTitle}>{item.strMeal}</Text>
        <RatingComponent
          initialRating={item.rating}
          isReadOnly
        />
        <Text style={styles.ratingDisplay}>
          Rating: {item.rating.toFixed(1)} / 5
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#6A9E56" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Highest Rated Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderRecipeCard}
      />
      <StatusBar style="dark" />
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
    fontWeight: "bold",
    color: "#6A9E56",
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
    width: "100%",
    height: wp(30),
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    color: "#6A9E56",
  },
  ratingDisplay: {
    fontSize: 14,
    color: "#6A9E56",
    textAlign: "center",
    marginTop: 5,
  },
});