import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ExploreRecipesScreen from '../screens/ExploreRecipesScreen';
import Menu from '../components/Menu';
import FavouriteRecipesScreen from '../screens/FavouriteRecipesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Categories from '../components/categories';
import IngredientSearch from '../components/IngredientSearch';
import RatingComponent from '../components/RatingComponent';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import HighestRatingRecipeScreen from '../screens/HighestRatingRecipeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminScreen from '../screens/AdminScreen';
import RandomRecipeScreen from '../screens/RandomRecipeScreen';
import PreferencesScreen from '../screens/PrefencesScreen';
import InputDetailsScreen from '../screens/InputDetailsScreen';
import RecipeSuggestionsScreen from '../screens/RecipeSuggestionsScreen';
import RecipeInstructionsScreen from '../screens/RecipeInstructionsScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null indicates loading
  const [userType, setUserType] = useState(null); // null indicates loading

  // Function to retrieve login status and user type from AsyncStorage
  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      const userType1 = await AsyncStorage.getItem('userType');
      console.log(data, userType1, 'at index.js');
      
      setIsLoggedIn(data === 'true'); // Convert string to boolean
      setUserType(userType1);
    } catch (error) {
      console.error('Error fetching data from AsyncStorage', error);
      setIsLoggedIn(false); // Default to false on error
      setUserType(null); // Set to null if error occurs
    }
  };

  useEffect(() => {
    getData(); // Fetch login and userType on component mount
  }, []);

  // Show a loading screen while determining login status
  if (isLoggedIn === null || userType === null) {
    return (
      <View style={{ flex: 1 }}>
        <HomeScreen />
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8fbc8f" />
        </View>
      </View>
    );
  }

  // Determine the initial route based on login status and user type
  const initialRoute = isLoggedIn
    ? userType === 'admin'
      ? 'AdminScreen'
      : 'ExploreRecipes'
    : 'Home';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute} // Dynamic initial route
        screenOptions={{
          headerStyle: { backgroundColor: '#8fbc8f' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Quick Start" }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Access Zone" }}
        />
        <Stack.Screen
          name="ExploreRecipes"
          component={ExploreRecipesScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Menues"
          component={Menu}
          options={{ title: "Option" }}
        />
        <Stack.Screen
          name="Favourites"
          component={FavouriteRecipesScreen}
          options={{ title: "Favorites" }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "Search History" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Menu" }}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{ title: "Categories" }}
        />
        <Stack.Screen
          name="IngredientSearch"
          component={IngredientSearch}
          options={{ title: "Ingredient Search" }}
        />
        <Stack.Screen
          name="RatingComponent"
          component={RatingComponent}
          options={{ title: "Rating Component" }}
        />
        <Stack.Screen
          name="AdminScreen"
          component={AdminScreen}
          options={{ title: "Admin Log" }}
        />
        <Stack.Screen
          name="RecipeDetails"
          component={RecipeDetailsScreen}
        />
        <Stack.Screen
          name="HighestRatingRecipe"
          component={HighestRatingRecipeScreen}
        />
        <Stack.Screen 
          name="RandomRecipe" 
          component={RandomRecipeScreen} 
          options={{ title: "Random Recipe" }} 
        />
        <Stack.Screen 
          name="PreferencesScreen" 
          component={PreferencesScreen} 
          options={{ title: "Preferences" }} 
        />
        <Stack.Screen 
          name="InputDetails" 
          component={InputDetailsScreen} 
          options={{ title: 'Input Details' }} 
        />
        <Stack.Screen 
          name="RecipeSuggestions" 
          component={RecipeSuggestionsScreen} 
          options={{ title: 'Recipe Suggestions' }} 
        />
        <Stack.Screen name="RecipeInstructionsScreen" component={RecipeInstructionsScreen} options={{ title: 'instructions' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default AppNavigation;
