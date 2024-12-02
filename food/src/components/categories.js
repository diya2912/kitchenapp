import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Categories({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveCategory(cat.strCategory)}
            style={[
              styles.categoryButton,
              cat.strCategory === activeCategory && styles.activeCategoryButton
            ]}
          >
            <View
              style={[
                styles.imageContainer,
                cat.strCategory === activeCategory && styles.activeImageContainer
              ]}
            >
              <Image
                source={{ uri: cat.strCategoryThumb }}
                style={[
                  styles.categoryImage,
                  cat.strCategory === activeCategory && styles.activeCategoryImage
                ]}
              />
            </View>
            <Text
              style={[
                styles.categoryText,
                cat.strCategory === activeCategory && styles.activeCategoryText
              ]}
            >
              {cat.strCategory}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(0),
    marginVertical: hp(0.1),
  },
  scrollViewContent: {
    paddingHorizontal: wp(4),
  },
  categoryButton: {
    alignItems: "center",
    marginRight: wp(2),
    borderRadius: hp(2), // Ensures the button itself is rounded
    overflow: 'hidden', // Clips content to border radius
  },
  categoryText: {
    fontSize: hp(1.6),
    color: "#6A9E56",
    marginTop: hp(1),
    textAlign: "center",
  },
  activeCategoryButton: {
    borderWidth: 2,
    borderColor: '#6A9E56', // Green border for active category
    backgroundColor: 'rgba(106, 158, 86, 0.2)', // Light green background for active category
    padding: 6,
  },
  imageContainer: {
    borderRadius: hp(4),
    padding: 6,
    width: hp(8),
    height: hp(8),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Default background color
  },
  activeImageContainer: {
    backgroundColor: "rgba(106, 158, 86, 0.2)", // Light green background for active category
    borderRadius: hp(4), // Ensures the image container is rounded
  },
  categoryImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
  },
  activeCategoryImage: {
    borderColor: '#6A9E56', // Green border for active category
    borderWidth: 2,
    borderRadius: hp(3), // Ensures the image itself is rounded
  },
  activeCategoryText: {
    color: '#6A9E56', // Highlighted text color for active category
    fontWeight: 'bold',
  },
});
