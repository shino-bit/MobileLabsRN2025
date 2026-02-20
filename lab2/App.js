import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';


import { darkTheme } from './theme/themes';
import StoreScreen from './screens/StoreScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: darkTheme.background,
              borderTopColor: darkTheme.surfaceLight,
            },
            tabBarActiveTintColor: darkTheme.accent,
            tabBarInactiveTintColor: darkTheme.subText,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Store') iconName = 'bag-handle';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Store" component={StoreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}