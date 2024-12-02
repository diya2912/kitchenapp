import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Categories from "../components/categories";
import IngredientSearch from "../components/IngredientSearch";
import { useNavigation } from "@react-navigation/native";
import RatingComponent from "../components/RatingComponent";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExploreRecipesScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const menuWidth = screenWidth * 0.5;
  const menuTranslateX = new Animated.Value(screenWidth);
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [recipesByIngredient, setRecipesByIngredient] = useState({});
  const [averageRatings, setAverageRatings] = useState({});
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      getRecipesByCategory(activeCategory);
    }
  }, [activeCategory]);

  const getCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        const response = await axios.get(
          "https://themealdb.com/api/json/v1/1/categories.php"
        );
        if (response && response.data) {
          setCategories(response.data.categories);
          await AsyncStorage.setItem('categories', JSON.stringify(response.data.categories));
        }
      }
    } catch (err) {
      console.log("Error fetching categories:", err.message);
    }
  };

  const getRecipesByCategory = async (category) => {
    try {
      const response = await axios.get(
        `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      if (response && response.data) {
        setRecipesByIngredient({ [category]: response.data.meals });
      }
    } catch (err) {
      console.log("Error fetching recipes:", err.message);
    }
  };

  const getRecipesByIngredients = async (ingredients) => {
    const results = {};
    for (let ingredient of ingredients) {
      try {
        const response = await axios.get(
          `https://themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
        );
        if (response && response.data && response.data.meals) {
          results[ingredient] = response.data.meals;
        } else {
          results[ingredient] = [];
          console.log(`No recipes found for ingredient: ${ingredient}`);
        }
      } catch (err) {
        console.log(
          `Error fetching recipes by ingredient ${ingredient}:`,
          err.message
        );
      }
    }
    setRecipesByIngredient(results);
  };

  const addToHistory = async (recipe) => {
    try {
      let currentHistory = await AsyncStorage.getItem('searchHistory');
      currentHistory = currentHistory ? JSON.parse(currentHistory) : [];

      // Check if the recipe already exists in the history
      const exists = currentHistory.some(item => item.idMeal === recipe.idMeal);
      if (!exists) {
        currentHistory.push(recipe);
        await AsyncStorage.setItem('searchHistory', JSON.stringify(currentHistory));
      }
    } catch (error) {
      console.log("Error adding to search history:", error.message);
    }
  };

  const handleRecipePress = async (recipeId) => {
    // Fetch the detailed recipe data from the API
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
      if (response && response.data && response.data.meals) {
        const recipe = response.data.meals[0];

        // Add the recipe to the history
        await addToHistory(recipe);

        // Navigate to the RecipeDetails screen
        navigation.navigate("RecipeDetails", { recipeId });
      }
    } catch (err) {
      console.log("Error fetching detailed recipe:", err.message);
    }
  };

  const handleRatingChange = (recipeId, newRating) => {
    setAverageRatings((prevRatings) => ({
      ...prevRatings,
      [recipeId]: newRating,
    }));
  };

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      return loggedIn === 'true';
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  };

  const toggleFavorite = async (recipe) => {
    const isLoggedIn = await checkLoginStatus();

    if (!isLoggedIn) {
      // Show a message or navigate to login screen
      Alert.alert('Login Required', 'Please log in to add recipes to favorites.');
      return;
    }

    setFavoriteRecipes((prevFavorites) => {
      const isFavorite = prevFavorites.find((fav) => fav.idMeal === recipe.idMeal);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter((fav) => fav.idMeal !== recipe.idMeal)
        : [...prevFavorites, recipe];

      // Update AsyncStorage with new favorites
      AsyncStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };

  const renderRecipeCard = ({ item }) => {
    const averageRating = averageRatings[item.idMeal] || 0;
    const isFavorite = favoriteRecipes.some((fav) => fav.idMeal === item.idMeal);

    return (
      <TouchableOpacity onPress={() => handleRecipePress(item.idMeal)}>
        <View style={styles.recipeCard}>
          <Image
            source={{ uri: item.strMealThumb }}
            style={styles.recipeImage}
          />
          <Text style={styles.recipeTitle}>{item.strMeal}</Text>
          <RatingComponent
            initialRating={averageRating}
            onRatingChange={(newRating) =>
              handleRatingChange(item.idMeal, newRating)
            }
            isFavorite={isFavorite}
            onToggleFavorite={() => toggleFavorite(item)}
          />
          <Text style={styles.ratingDisplay}>
            Current Rating: {averageRating.toFixed(1)} / 5
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderIngredientSection = ({ item }) => {
    const [ingredient, recipes] = item;
    return (
      <View key={ingredient}>
        <Text style={styles.sectionTitle}>
          Recipes for {ingredient}
        </Text>
        {recipes.length > 0 ? (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderRecipeCard}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noRecipesText}>
            No recipes found for "{ingredient}".
          </Text>
        )}
      </View>
    );
  };

  const toggleMenu = () => {
    const toValue = menuOpen ? screenWidth : screenWidth - menuWidth;
    setMenuOpen(!menuOpen);
    Animated.timing(menuTranslateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (!menuOpen) { // Navigate to Menus screen only when the menu is opening
        navigation.navigate('Menues');
      }
    });
  };

  const categoryStyle = (category) => ({
    borderColor: category === activeCategory ? '#6A9E56' : '#ccc', // Green for active, gray for inactive
    borderWidth: 2,
    backgroundColor: category === activeCategory ? 'rgba(106, 158, 86, 0.2)' : 'transparent', // Light green background for active
    padding: 10,
    borderRadius: 25,
    margin: 5,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(recipesByIngredient)}
        keyExtractor={(item) => item[0]}
        renderItem={renderIngredientSection}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Image
                source={require("../../assets/images/main.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Kitchen Genie</Text>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={toggleMenu}
              >
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </TouchableOpacity>
            </View>
            
            <IngredientSearch onSearch={getRecipesByIngredients} />
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categoryStyle={categoryStyle}
            />
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate("HighestRatingRecipe")}
            >
              <Text style={styles.historyButtonText}>View Highest Rated Recipes</Text>
            </TouchableOpacity>
          </>
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7c3",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 24,
    fontFamily: "Cursive",
    color: "#6A9E56",
  },
  menuButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLine: {
    width: 20,
    height: 3,
    backgroundColor: "#6A9E56",
    marginVertical: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#6A9E56",
  },
  noRecipesText: {
    fontSize: 16,
    color: "#6A9E56",
    paddingBottom: 10,
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
    height: hp(20),
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
  historyButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6A9E56",
    borderRadius: 5,
  },
  historyButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
