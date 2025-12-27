import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { auth, database } from '../firebase'
import { SegmentedButtons } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'driver'

  const handleLogin = async () => {
    // Validate login credentials
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      // Sign in the user with email and password
      const user = await auth.signInWithEmailAndPassword(email, password);

      // Redirect to the home screen
      navigation.navigate('SetHome');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again later.');
    }
  };

  const handleSignup = async () => {
    // Validate signup credentials
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Store user role in Realtime Database
      await database.ref('users/' + user.uid).set({
        email: email,
        role: role
      });

      console.log('User registered with role:', role);
      // Redirect to the home screen
      navigation.navigate('SetHome');

    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred during signup. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.roleContainer}>
        <SegmentedButtons
          value={role}
          onValueChange={setRole}
          buttons={[
            {
              value: 'user',
              label: 'User',
            },
            {
              value: 'driver',
              label: 'Driver',
            },
          ]}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={email === '' || password === ''}
      >
        Login
      </Button>
      <Button
        mode="contained"
        onPress={handleSignup}
        style={styles.button}
      >
        Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '80%',
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  roleContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default LoginScreen;