import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, 
          
          tabBarStyle: { 
            backgroundColor: '#1E1E1E', 
            borderTopColor: '#333',     
            height: 60,
            paddingBottom: 5,
          },
          tabBarActiveTintColor: '#BB86FC', 
          tabBarInactiveTintColor: '#888888', 

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Головна') {
              iconName = focused ? 'home' : 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {}
        <Tab.Screen name="Головна" component={HomeScreen} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}