import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import MainScreen from './screens/MainScreen';
import TasksScreen from './screens/TasksScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Гра') {
              iconName = focused ? 'game-controller' : 'game-controller-outline';
            } else if (route.name === 'Завдання') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Гра" component={MainScreen} />
        <Tab.Screen name="Завдання" component={TasksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}