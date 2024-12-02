import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import CheckBox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileVerify, setMobileVerify] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signName, setSignName] = useState('');
  const [signPwd, setSignPwd] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [secretKey, setSecretKey] = useState('');
  const [secretKeyVerify, setSecretKeyVerify] = useState(false);

  const handleSign = () => {
    console.log(signName, signPwd);
    const userData = {
      email: signName,
      password: signPwd,
    };
    axios.post("http://192.168.118.243:5001/login-user", userData)
      .then(res => {
        console.log(res.data);
        if (res.data.status === "ok") {
          Alert.alert('Login Successful');
          AsyncStorage.setItem('token', res.data.data);
          AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
          AsyncStorage.setItem('userType',res.data.userType);
          // navigation.navigate('ExploreRecipes');
          if(res.data.userType=="admin"){
            navigation.navigate('AdminScreen');
          }else{
            navigation.navigate('ExploreRecipes');
          }
        }
      });
  };


  
  const handleSubmit = () => {
    if (selectedRole === 'admin' && secretKey !== 'key123') {
      Alert.alert('Invalid Secret Key', 'The secret key you entered is incorrect.');
      return; 
    }

    const userData = {
      name: username,
      email,
      password,
      phoneNumber,
      userType: selectedRole,
      ...(selectedRole === 'admin' && { secretKey }), // Include secret key only if admin
    };

    if (nameVerify && emailVerify && passwordVerify && mobileVerify && (selectedRole !== 'admin' || secretKeyVerify)) {
      axios.post("http://192.168.118.243:5001/register", userData)
        .then(res => {
          console.log(res.data);
          if (res.data.status === "ok") {
            Alert.alert(
              'Registration Successful!',
              selectedRole === 'admin' ? 'You are now registered as an admin.' : 'Please sign in with your new account',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setIsSignIn(true);
                  }
                }
              ]
            );
          } else {
            Alert.alert(JSON.stringify(res.data));
          }
        })
        .catch(e => console.log(e));
    } else {
      Alert.alert("Fill mandatory details");
    }
  };

  const handleName = (e) => {
    const nameVar = e.nativeEvent.text;
    setUsername(nameVar);
    setNameVerify(nameVar.length > 1);
  };

  const handleEmail = (e) => {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar));
  };

  const handleMobile = (e) => {
    const mobileVar = e.nativeEvent.text;
    setPhoneNumber(mobileVar);
    setMobileVerify(/[6-9]{1}[0-9]{9}/.test(mobileVar));
  };

  const handlePassword = (e) => {
    const passVar = e.nativeEvent.text;
    setPassword(passVar);
    setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passVar));
  };

  const handleSecretKey = (e) => {
    const keyVar = e.nativeEvent.text;
    setSecretKey(keyVar);
    setSecretKeyVerify(keyVar.length >= 5);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={true}>
      <SafeAreaView style={styles.container}>
        <Image source={require('../../assets/images/main.png')} style={styles.logo} />
        <Text style={styles.title}>Kitchen Genie</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setIsSignIn(true)}>
            <Text style={[styles.toggleText, isSignIn && styles.activeToggleText]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignIn(false)}>
            <Text style={[styles.toggleText, !isSignIn && styles.activeToggleText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {isSignIn ? (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                onChange={e => setSignName(e.nativeEvent.text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry
                onChange={e => setSignPwd(e.nativeEvent.text)}
              />
            </View>
            <View style={styles.rememberMeContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe}
                style={styles.checkbox}
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Password recovery process')}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSign}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.roleContainer}>
              <Text style={styles.roleText}>Login as:</Text>
              <View style={styles.radioContainer}>
                <RadioButton
                  value="user"
                  status={selectedRole === 'user' ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedRole('user')}
                />
                <Text style={styles.radioText}>User</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton
                  value="admin"
                  status={selectedRole === 'admin' ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedRole('admin')}
                />
                <Text style={styles.radioText}>Admin</Text>
              </View>
            </View>
             {/* Conditionally Render Secret Key Input Field */}
             {selectedRole === 'admin' && (
              <View style={styles.inputContainer}>
                <MaterialIcons name="key" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Secret Key"
                  value={secretKey}
                  onChange={handleSecretKey}
                />
                {secretKey.length < 1 ? null : secretKeyVerify ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : (
                  <Ionicons name="close-circle" color="red" size={20} />
                )}
              </View>
            )}
            {secretKey.length < 1 || selectedRole !== 'admin' ? null : secretKeyVerify ? null : (
              <Text style={styles.errorText}>Secret key should be at least 5 characters long.</Text>
            )}
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChange={handleName}
              />
              {username.length < 1 ? null : nameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Ionicons name="close-circle" color="red" size={20} />
              )}
            </View>
            {username.length < 1 ? null : nameVerify ? null : (
              <Text style={styles.errorText}>Name should be more than 1 character.</Text>
            )}
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChange={handleEmail}
              />
              {email.length < 1 ? null : emailVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Ionicons name="close-circle" color="red" size={20} />
              )}
            </View>
            {email.length < 1 ? null : emailVerify ? null : (
              <Text style={styles.errorText}>Enter a proper email address.</Text>
            )}
            <View style={styles.inputContainer}>
              <MaterialIcons name="phone" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                maxLength={10}
                onChange={handleMobile}
              />
              {phoneNumber.length < 1 ? null : mobileVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Ionicons name="close-circle" color="red" size={20} />
              )}
            </View>
            {phoneNumber.length < 1 ? null : mobileVerify ? null : (
              <Text style={styles.errorText}>Phone number should start with 6-9 and remaining digits can be 0-9.</Text>
            )}
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChange={handlePassword}
                secureTextEntry={showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? null : !showPassword ?
                  <Feather name="eye" style={{ marginRight: 5 }} color={passwordVerify ? 'green' : 'red'} size={23} /> :
                  <Feather name="eye-off" style={{ marginRight: 5 }} color={passwordVerify ? 'green' : 'red'} size={23} />}
              </TouchableOpacity>
            </View>
            {password.length < 1 ? null : passwordVerify ? null : (
              <Text style={styles.errorText}>Uppercase, Lowercase, Number, and 6 or more characters.</Text>
            )}
           
            <View style={styles.rememberMeContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe}
                style={styles.checkbox}
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#888',
  },
  activeToggleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    height: 40,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 5,
  },
  forgotPasswordText: {
    color: '#0000ee',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#8fbc8f',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  checkbox: {
    marginRight: 10,
  },
  errorText: {
    marginLeft: 20,
    color: 'red',
  },
  roleContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 18,
    marginRight: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 5,
  },
});
