import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { mealAPI } from '../services/api';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [randomMeal, setRandomMeal] = useState(null);

  const searchMeals = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Por favor ingresa un término de búsqueda');
      return;
    }

    try {
      setLoading(true);
      const results = await mealAPI.searchMeals(searchQuery);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const getRandomMeal = async () => {
    try {
      setLoading(true);
      const meal = await mealAPI.getRandomMeal();
      setRandomMeal(meal);
      navigation.navigate('RecipeDetail', { mealId: meal.idMeal });
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener una receta aleatoria');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('RecipeDetail', { mealId: item.idMeal })}
    >
      <Image
        source={{ uri: item.strMealThumb }}
        style={styles.resultImage}
        resizeMode="cover"
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>
          {item.strMeal}
        </Text>
        <Text style={styles.resultCategory}>{item.strCategory}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Buscar Recetas</Text>
        <Text style={styles.subtitle}>Encuentra tu receta favorita</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre de receta..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchMeals}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchMeals}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.randomButton} onPress={getRandomMeal}>
        <Text style={styles.randomButtonText}>🎲 Receta Aleatoria</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      {!loading && hasSearched && (
        <View style={styles.resultsContainer}>
          {searchResults.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No se encontraron recetas para "{searchQuery}"
              </Text>
              <Text style={styles.noResultsSubtext}>
                Intenta con otro término de búsqueda
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultsTitle}>
                Resultados para "{searchQuery}" ({searchResults.length})
              </Text>
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.idMeal}
                numColumns={2}
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>
      )}

      {!loading && !hasSearched && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            🔍 Busca recetas por nombre
          </Text>
          <Text style={styles.welcomeSubtext}>
            O prueba una receta aleatoria
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  randomButton: {
    backgroundColor: '#FF9800',
    borderRadius: 25,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  randomButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultCard: {
    width: (width - 30) / 2,
    margin: 5,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultImage: {
    width: '100%',
    height: 120,
  },
  resultInfo: {
    padding: 12,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchScreen;
