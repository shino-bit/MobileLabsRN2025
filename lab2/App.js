import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { darkTheme, lightTheme } from './theme/themes';
import StoreScreen from './screens/StoreScreen';
import CommunityScreen from './screens/CommunityScreen'; 
import ChatScreen from './screens/ChatScreen';
import SafetyScreen from './screens/SafetyScreen';
import ProfileScreen from './screens/ProfileScreen';

// 1. Створюємо контекст, щоб інші екрани могли перемикати тему
export const ThemeContext = createContext();

const Tab = createBottomTabNavigator();

export default function App() {
  // 2. Стан: за замовчуванням темна тема (true)
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // 3. Функція для зміни теми
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  // 4. Визначаємо активну конфігурацію кольорів
  const currentTheme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      <ThemeProvider theme={currentTheme}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: currentTheme.background, // Динамічний фон таб-бару
                borderTopColor: currentTheme.surfaceLight,
                height: 60,
                paddingBottom: 10,
              },
              tabBarActiveTintColor: currentTheme.accent,
              tabBarInactiveTintColor: currentTheme.subText,
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
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Store" component={StoreScreen} />
            <Tab.Screen name="Community" component={CommunityScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Safety" component={SafetyScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}