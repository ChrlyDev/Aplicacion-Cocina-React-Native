import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import favoritesService from '../services/favoritesService';

const { width } = Dimensions.get('window');

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
    
    // Listen to real-time changes
    const unsubscribe = favoritesService.onFavoritesChange((updatedFavorites) => {
      setFavorites(updatedFavorites);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await favoritesService.getAllFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los favoritos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const removeFromFavorites = async (mealId, mealName) => {
    Alert.alert(
      'Confirmar',
      `¿Estás seguro de que quieres eliminar "${mealName}" de favoritos?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesService.removeFromFavorites(mealId);
              // The real-time listener will update the state automatically
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar de favoritos');
            }
          },
        },
      ]
    );
  };

  const navigateToRecipeDetail = (mealId) => {
    navigation.navigate('RecipeDetail', { mealId });
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => navigateToRecipeDetail(item.idMeal)}
    >
      <Image
        source={{ uri: item.strMealThumb }}
        style={styles.favoriteImage}
        resizeMode="cover"
      />
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteTitle} numberOfLines={2}>
          {item.strMeal}
        </Text>
        <Text style={styles.favoriteCategory}>
          {item.strCategory} • {item.strArea}
        </Text>
        <Text style={styles.favoriteDate}>
          Agregado: {new Date(item.dateAdded).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item.idMeal, item.strMeal)}
      >
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={styles.emptyTitle}>No tienes favoritos</Text>
      <Text style={styles.emptySubtitle}>
        Explora recetas y agrega tus favoritas tocando el corazón
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Categories')}
      >
        <Text style={styles.exploreButtonText}>Explorar Recetas</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FF6B6B',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 80,
  },
  list: {
    padding: 20,
  },
  emptyList: {
    flex: 1,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  favoriteInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  favoriteCategory: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 5,
  },
  favoriteDate: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
  },
  removeButtonText: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  exploreButtonText: {
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
});

export default FavoritesScreen;
