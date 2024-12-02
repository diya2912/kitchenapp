import { View, Text, StyleSheet, ScrollView, Image, FlatList, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

export default function RecipeDetailsScreen() {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const route = useRoute();
  const { recipeId, preferences = {} } = route.params; // Default preferences to an empty object

  useEffect(() => {
    fetchRecipeDetails(recipeId);
  }, [recipeId]);

  const fetchRecipeDetails = async (id) => {
    try {
      const response = await axios.get(
        `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      if (response && response.data && response.data.meals) {
        setRecipeDetails(response.data.meals[0]);
        generateVideoLink(response.data.meals[0]); // Generate a video link based on recipe details
      }
    } catch (error) {
      console.log("Error fetching recipe details:", error.message);
    }
  };

  // Function to generate a video link based on recipe properties
  const generateVideoLink = (meal) => {
    const videoLinks = {
      Beef: "https://youtu.be/YW48gEX8rg4?si=vtH2d73T10cJ1OT0", // Replace with actual video IDs
      Chicken: "https://youtu.be/rmJ2pwXz1Yc?si=A0Eh9HvXJRx_rPN9",
      Vegetarian: "https://youtube.com/playlist?list=PLnj9UGe965p3Ba1iAPiljRfskNDl0FbUE&si=XNAHQu0y1LSxfu3K",
      Seafood: "https://youtu.be/IwkHyDZynF0?si=Q5QuWfd1IjZ5pVzQ",
      // Add more categories and corresponding video links as needed
    };
    const category = meal.strCategory || "Default"; // Fallback to a default category if none exists
    const selectedVideo = videoLinks[category] || "https://youtu.be/YW48gEX8rg4?si=vtH2d73T10cJ1OT0"; // Default video link if category not found

    setVideoLink(selectedVideo);
  };
  const getRandomCookingTime = () => Math.floor(Math.random() * 30) + 20;
  const getMealDifficulty = () => {
    const difficulties = ["Easy", "Medium", "Hard"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };
  const getRandomCalories = () => Math.floor(Math.random() * 500) + 100;
  const getRandomWeight = () => Math.floor(Math.random() * 300) + 50;

  const matchPreferences = () => {
    if (!recipeDetails) return false;
    const cookingTime = getRandomCookingTime();
    const weight = getRandomWeight();
    const difficulty = getMealDifficulty();
    const calories = getRandomCalories();
    const matchesTime = preferences.cookingTime ? cookingTime <= preferences.cookingTime : true;
    const matchesWeight = preferences.weight ? weight <= preferences.weight : true;
    const matchesDifficulty = preferences.difficulty ? difficulty.toLowerCase() === preferences.difficulty.toLowerCase() : true;
    const matchesCalories = preferences.calories ? calories <= preferences.calories : true;
    return matchesTime && matchesWeight && matchesDifficulty && matchesCalories;
  };
  if (!recipeDetails) {
    return <Text>Loading...</Text>;
  }

  if (!matchPreferences()) {
    return <Text>No recipes match your preferences. Please try different options.</Text>;
  }
  const ingredients = Object.keys(recipeDetails)
    .filter((key) => key.includes("strIngredient") && recipeDetails[key])
    .map((key) => {
      const number = key.match(/\d+/)[0];
      return {
        ingredient: recipeDetails[key],
        measure: recipeDetails[`strMeasure${number}`],
      };
    });

  const isVeg = recipeDetails.strCategory === "Vegetarian" || recipeDetails.strCategory === "Vegetarian";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: recipeDetails.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{recipeDetails.strMeal}</Text>
      <Text style={styles.category}>{recipeDetails.strCategory}</Text>
      <Text style={styles.area}>{recipeDetails.strArea} Cuisine</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/images/time.jpg")}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{getRandomCookingTime()} mins</Text>
        </View>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/images/difficulty.jpg")}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{getMealDifficulty()}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/images/calories.jpg")}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{getRandomCalories()} kcal</Text>
        </View>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/images/weight.jpg")}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{getRandomWeight()} g</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        {isVeg ? "Vegetarian Recipes" : "Non-Vegetarian Recipes"}
      </Text>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <FlatList
        data={ingredients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.ingredient}>
            • {item.ingredient} - {item.measure}
          </Text>
        )}
      />
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{recipeDetails.strInstructions}</Text>
      <Text style={styles.sectionTitle}>Watch Recipe Video</Text>
      {videoLink ? (
        <Text
          style={styles.videoLink}
          onPress={() => Linking.openURL(videoLink)}
        >
          Watch on YouTube
        </Text>
      ) : (
        <Text>No video available for this recipe.</Text>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Allow ScrollView to grow based on content
    padding: 20,
    backgroundColor: "#f0f7c3",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A9E56",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#8DC63F",
  },
  area: {
    fontSize: 16,
    color: "#8DC63F",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#6A9E56",
  },
  ingredient: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  videoLink: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});