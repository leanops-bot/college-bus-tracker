import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import LoginScreen from './LoginScreen';
import SetHomeLocation from './SetHome';
import BusList from './BusList';
import RouteMap from './RouteMap';
import DriverDashboard from './DriverDashboard';
import { auth, database } from '../firebase';

const Stack = createStackNavigator();
const LoggedStack = createStackNavigator();

function LoggedLayout() {
  return (
    <LoggedStack.Navigator>
      <Stack.Screen name="SetHome" component={SetHomeLocation} />
      <Stack.Screen name="BusList" component={BusList} />
      <Stack.Screen name="RouteMap" component={RouteMap} />
    </LoggedStack.Navigator>
  )
}

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch user role
        try {
          const snapshot = await database.ref(`users/${user.uid}/role`).once('value');
          const userRole = snapshot.val();
          setRole(userRole || 'user'); // Default to 'user' if null
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole('user'); // Default to user if error
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return null; // Or a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          role === 'driver' ? (
            <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
          ) : (
            <Stack.Screen name="UserHome" component={LoggedLayout} />
          )
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppWrapper = () => {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
};

export default AppWrapper;