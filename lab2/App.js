import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { darkTheme } from './theme/themes';
import StoreScreen from './screens/StoreScreen';
import CommunityScreen from './screens/CommunityScreen'; 
import ChatScreen from './screens/ChatScreen';
import SafetyScreen from './screens/SafetyScreen'; 

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
              borderTopColor: darkTheme.surfaceLight || '#2a475e',
              height: 60,
              paddingBottom: 10,
            },
            tabBarActiveTintColor: darkTheme.accent,
            tabBarInactiveTintColor: darkTheme.subText,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Store') {
                iconName = focused ? 'bag-handle' : 'bag-handle-outline';
              } else if (route.name === 'Community') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'Chat') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              } else if (route.name === 'Safety') {
                iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Store" component={StoreScreen} />
          <Tab.Screen name="Community" component={CommunityScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Safety" component={SafetyScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}