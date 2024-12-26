import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../components/screens/HomeScreen';
import ProfileScreen from '../components/screens/ProfileScreen';
import CalorieScreen from '../components/screens/CalorieScreen';


const Drawer = createDrawerNavigator();

const appTitle = "StayFit";

export default function Index() {
  return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} options={{headerTitle: appTitle}}/>
        <Drawer.Screen name="Calories" component={CalorieScreen} options={{headerTitle: appTitle}}/>
        <Drawer.Screen name="Profile" component={ProfileScreen} options={{headerTitle: appTitle}}/>
      </Drawer.Navigator>
  );
}