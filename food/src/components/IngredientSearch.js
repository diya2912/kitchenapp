import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const IngredientSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search when the button is pressed
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Split the search term into an array of ingredients
      const ingredients = searchTerm.split(',')
        .map(ingredient => ingredient.trim())
        .filter(Boolean);
      onSearch(ingredients);
      // Clear the input field after search
      setSearchTerm("");
    }
  };

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter ingredients"
        placeholderTextColor="#8DC63F"
        value={searchTerm}
        onChangeText={setSearchTerm}
        accessibilityLabel="Ingredient search input"
        accessibilityHint="Type ingredient names separated by commas"
      />
      <TouchableOpacity 
        style={styles.searchButton} 
        onPress={handleSearch}
        accessibilityLabel="Search"
        accessibilityHint="Press to search for recipes"
      >
        <Text style={styles.searchButtonText}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#8DC63F",
  },
  searchButton: {
    padding: 10,
  },
  searchButtonText: {
    fontSize: 18,
    color: "#8DC63F",
  },
});

export default IngredientSearch;
