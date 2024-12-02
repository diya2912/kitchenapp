import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedMobile, setUpdatedMobile] = useState('');
  const [updatedUserType, setUpdatedUserType] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.post('http://192.168.118.243:5001/userdata', { token });
        if (response.data.status === 'ok') {
          const data = response.data.data;
          setUserData(data);
          setUpdatedName(data.name);
          setUpdatedEmail(data.email);
          setUpdatedMobile(data.mobile);
          setUpdatedUserType(data.userType);
          setUpdatedAddress(data.address || '');
        } else {
          console.error('Error fetching user data:', response.data.data);
        }
      } else {
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleMobileChange = (text) => {
    // Allow only numbers and limit to 10 digits
    const filteredText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setUpdatedMobile(filteredText);
  };

  const handleEdit = async () => {
    const token = await AsyncStorage.getItem('token');
    const updatedData = {
      name: updatedName,
      email: updatedEmail,
      mobile: updatedMobile,
      userType: updatedUserType,
      address: updatedAddress,
    };

    // Validate only the fields that have been changed
    let hasError = false;
    if (updatedName !== userData.name && !updatedName) {
      Alert.alert('Validation Error', 'Name is required');
      hasError = true;
    }
    if (updatedEmail !== userData.email && (!updatedEmail || !/\S+@\S+\.\S+/.test(updatedEmail))) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      hasError = true;
    }
    if (updatedMobile !== userData.mobile && (!updatedMobile || updatedMobile.length !== 10)) {
      Alert.alert('Validation Error', 'Mobile number must be exactly 10 digits');
      hasError = true;
    }
    // Additional validation for user type and address can be added here

    if (hasError) return; // Stop if there are validation errors

    // Proceed with the update if no errors
    try {
      const response = await axios.post('http://192.168.118.243:5001/updateUser', { token, userDetails: updatedData });
      if (response.data.status === 'ok') {
        setUserData(updatedData);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        console.error('Error updating user data:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6A9E56" />
      ) : userData ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.profileIconContainer}>
            <Icon name="person-circle-outline" size={100} color="#6A9E56" />
          </View>

          <View style={styles.card}>
            {isEditing ? (
              <>
                <InputField
                  label="Name"
                  value={updatedName}
                  onChangeText={setUpdatedName}
                  icon="person-outline"
                  placeholder="Update Name"
                />
                <InputField
                  label="Email"
                  value={updatedEmail}
                  onChangeText={setUpdatedEmail}
                  icon="mail-outline"
                  placeholder="Update Email"
                />
                <InputField
                  label="Mobile"
                  value={updatedMobile}
                  onChangeText={handleMobileChange} // Use the new handler
                  icon="call-outline"
                  placeholder="Update Mobile"
                />
                <InputField
                  label="Address"
                  value={updatedAddress}
                  onChangeText={setUpdatedAddress}
                  icon="home-outline"
                  placeholder="Update Address"
                />
                <InputField
                  label="User Type"
                  value={updatedUserType}
                  onChangeText={setUpdatedUserType}
                  icon="person-circle-outline"
                  placeholder="Update User Type"
                />
                <Button title="Save" onPress={handleEdit} color="#6A9E56" />
              </>
            ) : (
              <>
                <DetailContainer label="Name" value={userData.name} icon="person-outline" />
                <DetailContainer label="Email" value={userData.email} icon="mail-outline" />
                <DetailContainer label="Mobile" value={userData.mobile} icon="call-outline" />
                <DetailContainer label="Address" value={userData.address || 'N/A'} icon="home-outline" />
                <DetailContainer label="User Type" value={userData.userType} icon="person-circle-outline" />
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                  <Icon name="create-outline" size={24} color="#6A9E56" />
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>No user data available.</Text>
      )}
    </View>
  );
}

const InputField = ({ label, value, onChangeText, icon, placeholder }) => (
  <View style={styles.detailContainer}>
    <Icon name={icon} size={20} color="#6A9E56" style={styles.icon} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  </View>
);

const DetailContainer = ({ label, value, icon }) => (
  <View style={styles.detailContainer}>
    <Icon name={icon} size={20} color="#6A9E56" style={styles.icon} />
    <Text style={styles.detail}>
      {label}: <Text style={styles.value}>{value}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f7c3',
  },
  userInfoContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4A4A4A',
  },
  profileIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e6f2e6',
    borderWidth: 2,
    borderColor: '#6A9E56',
  },
  card: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#e6f2e6',
    marginTop: 10,
    width: '100%',
    alignItems: 'flex-start',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 10,
  },
  detail: {
    fontSize: 18,
    color: '#333',
  },
  value: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6A9E56',
  },
  editText: {
    marginLeft: 5,
    color: '#6A9E56',
  },
  errorText: {
    color: 'red',
  },
});
