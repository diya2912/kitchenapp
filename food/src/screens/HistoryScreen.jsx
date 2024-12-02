// src/screens/SearchHistoryScreen.js

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchHistoryScreen() {
  const [searchHistory, setSearchHistory] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('searchHistory');
        if (history) {
          setSearchHistory(JSON.parse(history));
        }
      } catch (error) {
        console.log("Error fetching search history:", error.message);
      }
    };

    fetchSearchHistory();
  }, []);

  const handleRecipePress = (recipeId) => {
    navigation.navigate("RecipeDetails", { recipeId });
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRecipePress(item.idMeal)}>
      <View style={styles.historyCard}>
        <Image source={{ uri: item.strMealThumb }} style={styles.historyImage} />
        <Text style={styles.historyTitle}>{item.strMeal}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search History</Text>
      {searchHistory.length > 0 ? (
        <FlatList
          data={searchHistory}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderHistoryItem}
        />
      ) : (
        <Text style={styles.noHistoryText}>No search history available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f7c3",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A9E56",
    marginBottom: 20,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: "hidden",
  },
  historyImage: {
    width: 100,
    height: 100,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    color: "#6A9E56",
    flex: 1,
  },
  noHistoryText: {
    fontSize: 16,
    color: "#6A9E56",
    textAlign: "center",
    marginTop: 20,
  },
});