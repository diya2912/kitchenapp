import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreRecipesScreen from '../screens/ExploreRecipesScreen';
import Menus from './components/Menu';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import InputDetailsScreen from '../screens/InputDetailsScreen';


const Stack = createStackNavigator();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#8fbc8f' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="ExploreRecipes" component={ExploreRecipesScreen} />
      <Stack.Screen name="Menues" component={Menues} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Favourites" component={FavouritesScreen} />
      <Stack.Screen name="InputDetails" component={InputDetailsScreen} />
 
    </Stack.Navigator>
  );
}
