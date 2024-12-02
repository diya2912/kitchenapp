import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Radio Button Component
const CustomRadioButton = ({ label, checked, onChange }) => {
  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onChange}>
      <View style={[styles.radioCircle, checked && styles.selectedRadioCircle]}>
        {checked && <View style={styles.checkedIndicator} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

// Custom Checkbox Component
const CustomCheckBox = ({ label, checked, onChange }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onChange}>
      <View style={[styles.checkbox, checked && styles.checkedCheckbox]}>
        {checked && <Text style={styles.checkmark}>✔</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const InputDetailsScreen = () => {
  const navigation = useNavigation();
  const [weight, setWeight] = useState('');
  const [minutes, setMinutes] = useState('');
  const [foodPreference, setFoodPreference] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [hasBP, setHasBP] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasOther, setHasOther] = useState(false);
  const [otherCondition, setOtherCondition] = useState('');
  const [minCalories, setMinCalories] = useState('');
  const [maxCalories, setMaxCalories] = useState('');

  const handleSubmit = async () => {
    // Validate numeric inputs
    const weightNum = parseFloat(weight);
    const minutesNum = parseInt(minutes, 10);
    const minCaloriesNum = parseInt(minCalories, 10);
    const maxCaloriesNum = parseInt(maxCalories, 10);

    if (
      isNaN(weightNum) ||
      isNaN(minutesNum) ||
      isNaN(minCaloriesNum) ||
      isNaN(maxCaloriesNum) ||
      weightNum <= 0 ||
      minutesNum < 0 ||
      minCaloriesNum < 0 ||
      maxCaloriesNum <= minCaloriesNum
    ) {
      Alert.alert('Error', 'Please enter valid weight, cooking time, and calorie range!');
      return;
    }

    if (minCalories && maxCalories) {
      const userDetails = {
        weight: weightNum,
        minutes: minutesNum,
        foodPreference,
        difficulty,
        calories: {
          min: minCaloriesNum,
          max: maxCaloriesNum,
        },
        diseases: {
          bloodPressure: hasBP,
          diabetes: hasDiabetes,
          other: hasOther ? otherCondition : null,
        },
      };

      console.log('User Details:', userDetails); // Log user details for debugging

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not logged in! Please log in to save your details.');
          return;
        }

        const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
          // Post user details to the server
          const response = await axios.post("http://192.168.118.243:5001/save-user-details", {
            token,
            userDetails
          });

          console.log('Response from server:', response.data); // Log response for debugging

          if (response.data.status === "ok") {
            Alert.alert("Success", "Details saved successfully!");
            navigation.navigate('RecipeSuggestions', { userDetails });
          } else {
            Alert.alert("Error", response.data.data);
          }
        } else {
          Alert.alert('Error', 'User not logged in! Please log in to save your details.');
        }
      } catch (error) {
        Alert.alert("Error", "Failed to submit details: " + error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill in all required fields: weight and calorie range!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter Your Details</Text>

      {/* Weight Input */}
      <Text style={styles.weightLabel}>Weight (in kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholder="Weight"
      />

      {/* Minutes Input */}
      <Text style={styles.minutesLabel}>Cooking Time:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={minutes}
        onChangeText={setMinutes}
        placeholder="Minutes"
      />

      {/* Calorie Range Input */}
      <Text style={styles.calorieLabel}>Calorie Range:</Text>
      <View style={styles.calorieInputContainer}>
        <TextInput
          style={styles.calorieInput}
          keyboardType="numeric"
          value={minCalories}
          onChangeText={setMinCalories}
          placeholder="Min Calories"
        />
        <TextInput
          style={styles.calorieInput}
          keyboardType="numeric"
          value={maxCalories}
          onChangeText={setMaxCalories}
          placeholder="Max Calories"
        />
      </View>

      {/* Food Preferences Radio Buttons */}
      <Text style={styles.foodPrefLabel}>Food Preferences:</Text>
      <View style={styles.radioGroup}>
        <CustomRadioButton label="Vegetarian" checked={foodPreference === 'Vegetarian'} onChange={() => setFoodPreference('Vegetarian')} />
        <CustomRadioButton label="Non vegetarian" checked={foodPreference === 'Non vegetarian'} onChange={() => setFoodPreference('Non vegetarian')} />
      </View>

      {/* Difficulty Level Radio Buttons */}
      <Text style={styles.difficultyLabel}>Difficulty Level:</Text>
      <View style={styles.radioGroup}>
        <CustomRadioButton label="Easy" checked={difficulty === 'Easy'} onChange={() => setDifficulty('Easy')} />
        <CustomRadioButton label="Medium" checked={difficulty === 'Medium'} onChange={() => setDifficulty('Medium')} />
        <CustomRadioButton label="Hard" checked={difficulty === 'Hard'} onChange={() => setDifficulty('Hard')} />
      </View>

      {/* Health Conditions Checkboxes */}
      <Text style={styles.healthCondLabel}>Health Conditions:</Text>
      <View style={styles.checkboxGroup}>
        <CustomCheckBox label="Blood Pressure" checked={hasBP} onChange={() => setHasBP(!hasBP)} />
        <CustomCheckBox label="Diabetic" checked={hasDiabetes} onChange={() => setHasDiabetes(!hasDiabetes)} />
        <CustomCheckBox label="Other" checked={hasOther} onChange={() => setHasOther(!hasOther)} />
      </View>

      {/* Conditionally Render TextInput for "Other" Health Condition */}
      {hasOther && (
        <TextInput
          style={styles.input}
          value={otherCondition}
          onChangeText={setOtherCondition}
          placeholder="Enter Other Health Condition"
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Get Recipes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f0f7c3',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#4B7B3E',
  },
  weightLabel: {
    fontSize: 20,
    color: '#4B7B3E',
    marginBottom: 10,
  },
  minutesLabel: {
    fontSize: 20,
    color: '#4B7B3E',
    marginBottom: 10,
  },
  calorieLabel: {
    fontSize: 20,
    color: '#4B7B3E',
    marginBottom: 10,
  },
  calorieInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calorieInput: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#6A9E56',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 4,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#6A9E56',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6A9E56',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadioCircle: {
    borderColor: '#4B7B3E',
  },
  checkedIndicator: {
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: '#4B7B3E',
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  difficultyLabel: {
    fontSize: 20,
    color: '#4B7B3E',
    marginBottom: 10,
  },
  healthCondLabel: {
    fontSize: 20,
    color: '#4B7B3E',
    marginBottom: 10,
  },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 30,
    width: 30,
    borderWidth: 2,
    borderColor: '#6A9E56',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: '#4B7B3E',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  foodPrefLabel:{
    fontSize: 20,
    color: '#4B7B3E',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4B7B3E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default InputDetailsScreen;
