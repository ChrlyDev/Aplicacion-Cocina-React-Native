import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import CategoriesScreen from './screens/CategoriesScreen';
import RecipeListScreen from './screens/RecipeListScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import SearchScreen from './screens/SearchScreen';

const Stack = createStackNavigator();

const HeaderButton = ({ onPress, title, color = '#FF6B6B' }) => (
  <TouchableOpacity onPress={onPress} style={styles.headerButton}>
    <Text style={[styles.headerButtonText, { color }]}>{title}</Text>
  </TouchableOpacity>
);

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Categories"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FF6B6B',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Categories"
            component={CategoriesScreen}
            options={({ navigation }) => ({
              headerShown: false,
              headerRight: () => (
                <HeaderButton
                  onPress={() => navigation.navigate('Search')}
                  title="Buscar"
                  color="#fff"
                />
              ),
            })}
          />
          <Stack.Screen
            name="RecipeList"
            component={RecipeListScreen}
            options={({ navigation, route }) => ({
              headerShown: false,
              title: route.params?.categoryName || 'Recetas',
              headerRight: () => (
                <HeaderButton
                  onPress={() => navigation.navigate('Search')}
                  title="Buscar"
                  color="#fff"
                />
              ),
            })}
          />
          <Stack.Screen
            name="RecipeDetail"
            component={RecipeDetailScreen}
            options={{
              headerShown: false,
              title: 'Detalle de Receta',
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{
              headerShown: false,
              title: 'Buscar Recetas',
            }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerButton: {
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
