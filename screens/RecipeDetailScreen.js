import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import { mealAPI } from '../services/api';
import favoritesService from '../services/favoritesService';

const { width } = Dimensions.get('window');

const RecipeDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchRecipeDetails();
    checkFavoriteStatus();
  }, [mealId]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const data = await mealAPI.getMealById(mealId);
      setRecipe(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los detalles de la receta');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favoriteStatus = await favoritesService.isFavorite(mealId);
      setIsFavorite(favoriteStatus);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!recipe) return;
    
    try {
      setFavoriteLoading(true);
      const newFavoriteStatus = await favoritesService.toggleFavorite(recipe);
      setIsFavorite(newFavoriteStatus);
      
      Alert.alert(
        'Éxito',
        newFavoriteStatus 
          ? 'Receta agregada a favoritos' 
          : 'Receta eliminada de favoritos'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getIngredients = () => {
    if (!recipe) return [];
    
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients;
  };

  const openYouTube = () => {
    if (recipe.strYoutube) {
      Linking.openURL(recipe.strYoutube);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cargando receta...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la receta</Text>
      </View>
    );
  }

  const ingredients = getIngredients();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          disabled={favoriteLoading}
        >
          <Text style={styles.favoriteButtonText}>
            {favoriteLoading ? '...' : (isFavorite ? '❤️' : '🤍')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.strMeal}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Categoría</Text>
            <Text style={styles.infoValue}>{recipe.strCategory}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Origen</Text>
            <Text style={styles.infoValue}>{recipe.strArea}</Text>
          </View>
        </View>

        {recipe.strYoutube && (
          <TouchableOpacity style={styles.youtubeButton} onPress={openYouTube}>
            <Text style={styles.youtubeButtonText}>Ver Video en YouTube</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>
                • {item.measure} {item.ingredient}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparación</Text>
          <Text style={styles.instructionsText}>{recipe.strInstructions}</Text>
        </View>

        {recipe.strSource && (
          <TouchableOpacity 
            style={styles.sourceButton}
            onPress={() => Linking.openURL(recipe.strSource)}
          >
            <Text style={styles.sourceButtonText}>Ver Receta Original</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  imageContainer: {
    position: 'relative',
  },
  recipeImage: {
    width: width,
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  youtubeButton: {
    backgroundColor: '#FF0000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  youtubeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
    paddingBottom: 5,
  },
  ingredientItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sourceButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  sourceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default RecipeDetailScreen;
