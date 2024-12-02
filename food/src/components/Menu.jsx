import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icons

const Menu = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              // Clear the isLoggedIn flag from AsyncStorage
              await AsyncStorage.setItem('isLoggedIn', 'false');
              // Navigate to the Home screen
              navigation.navigate('Home');
            } catch (error) {
              console.error('Error clearing isLoggedIn from AsyncStorage', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.menuContainer}>
      {/* Menu Options */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Favourites')}>
        <Icon name="heart" size={24} color="#6A9E56" style={styles.icon} />
        <Text style={styles.menuText}>Favourites</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('History')}>
        <Icon name="time" size={24} color="#6A9E56" style={styles.icon} />
        <Text style={styles.menuText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
        <Icon name="person" size={24} color="#6A9E56" style={styles.icon} />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InputDetails')}>
  <Icon name="nutrition" size={24} color="#6A9E56" style={styles.icon} />
  <Text style={styles.menuText}>Get Recipe Suggestions</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
  <Icon name="home" size={24} color="#6A9E56" style={styles.icon} />
  <Text style={styles.menuText}>Home Page</Text>
</TouchableOpacity>


      {/* Logout Option */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={24} color="#6A9E56" style={styles.icon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#f0f7c3",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,  
    shadowColor: '#000',      
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,      
    shadowRadius: 8,          
    elevation: 5,             
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 10,         
    backgroundColor: '#f9f9f9', 
    marginVertical: 5,        
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 18,
    color: '#6A9E56',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9', 
    borderRadius: 10,         
    shadowColor: '#000',      
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2,       
    shadowRadius: 4,          
    elevation: 3,             
  },
  logoutText: {
    fontSize: 18,
    color: '#6A9E56',
  },
});

export default Menu;
