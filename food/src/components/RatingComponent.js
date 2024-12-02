// src/components/RatingComponent.js
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Make sure you have @expo/vector-icons installed
import debounce from 'lodash/debounce'; // Add lodash for debouncing

export default function RatingComponent({ initialRating = 0, onRatingChange, isFavorite, onToggleFavorite }) {
  const [rating, setRating] = useState(initialRating);

  // Debounce the rating change to optimize performance
  const handleRatingChange = useCallback(
    debounce((newRating) => {
      setRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    }, 200), // 200ms debounce delay
    [onRatingChange]
  );

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingLabel}>Rate this Recipe:</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRatingChange(star)} style={styles.starButton}>
            <FontAwesome
              name={star <= rating ? "star" : "star-o"}
              size={32}
              color="#FFD700"
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={32}
            color={isFavorite ? "#FF0000" : "#6A9E56"}
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  ratingLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: "#6A9E56",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    marginHorizontal: 2,
  },
  starIcon: {
    color: "#FFD700",
  },
  favoriteButton: {
    marginLeft: 10,
  },
  favoriteIcon: {
    color: "#6A9E56",
  },
});
