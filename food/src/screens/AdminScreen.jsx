import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import AdminIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeleteIcon from 'react-native-vector-icons/Ionicons';

function AdminScreen() {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const [allUserData, setAllUserData] = useState([]);

  async function getAllData() {
    axios.get("http://192.168.118.243:5001/get-all-user").then(res => {
      console.log(res.data);
      setAllUserData(res.data.data);
    });
  }

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log("Token:", token);
        const response = await axios.post("http://192.168.118.243:5001/userdata", { token });
        console.log("Response:", response.data);
        if (response.data.status === 'ok') {
          setUserData(response.data.data);
        } else {
          console.error("Error fetching user data:", response.data.data);
        }
      } else {
        console.error("No token found");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  useEffect(() => {
    getData();
    getAllData();
  }, []);

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
              await AsyncStorage.setItem('isLoggedIn', 'false');
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

  const handleDeleteUser = (data) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.post('http://192.168.118.243:5001/delete-user',{id:data._id})
              .then (res=>{
                console.log(res.data)
                if(res.data.status=="Ok"){
                  getAllData();
                }
              })
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error deleting user");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const UserCard = ({ data }) => (
    <View style={styles.card}>
      <UserIcon name="user" size={40} color="#6A9E56" style={styles.userIcon} />
      <View style={styles.cardDetails}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.email}>{data.email}</Text>
        <View style={styles.userTypeContainer}>
          <Text style={styles.userType}>{data.userType}</Text>
          {data.userType === "admin" && (
            <AdminIcon name="shield-account" size={20} color="#FFD700" style={styles.adminIcon} />
          )}
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDeleteUser(data)} style={styles.deleteIconContainer}>
        <DeleteIcon name="trash" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.menuContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.adminText}>Admin Panel</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={24} color="#6A9E56" style={styles.icon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.userInfoBox} activeOpacity={0.8}>
        {userData ? (
          <>
            <Text style={styles.userDetailName}>{userData.name}</Text>
            <Text style={styles.userDetailEmail}>{userData.email}</Text>
            <View style={styles.userTypeContainer}>
              <Text style={styles.userDetailType}>{userData.userType}</Text>
              {userData.userType === "admin" && (
                <AdminIcon name="shield-account" size={20} color="#FFD700" style={styles.adminIcon} />
              )}
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading user data...</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={allUserData}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <UserCard data={item} />}
        contentContainerStyle={styles.userList}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e6ffe6',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 18,
    color: '#6A9E56',
  },
  adminText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoBox: {
    marginTop: 30,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  userDetailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetailEmail: {
    fontSize: 18,
    color: '#999',
  },
  userDetailType: {
    fontSize: 18,
    color: '#6A9E56',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  flatList: {
    width: '100%',
  },
  userList: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userIcon: {
    marginRight: 15,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userType: {
    fontSize: 16,
    color: '#6A9E56',
    marginRight: 5,
  },
  adminIcon: {
    marginLeft: 5,
  },
  deleteIconContainer: {
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminScreen;
