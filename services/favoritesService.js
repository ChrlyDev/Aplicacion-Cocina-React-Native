import { database } from '../config/firebase';
import { ref, set, get, remove, push, onValue, off } from 'firebase/database';

class FavoritesService {
  constructor() {
    this.favoritesRef = ref(database, 'favorites');
  }

  // Add a recipe to favorites
  async addToFavorites(recipe) {
    try {
      const favoriteData = {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strCategory: recipe.strCategory,
        strArea: recipe.strArea,
        dateAdded: new Date().toISOString(),
      };

      const favoriteRef = ref(database, `favorites/${recipe.idMeal}`);
      await set(favoriteRef, favoriteData);
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Remove a recipe from favorites
  async removeFromFavorites(mealId) {
    try {
      const favoriteRef = ref(database, `favorites/${mealId}`);
      await remove(favoriteRef);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  // Check if a recipe is in favorites
  async isFavorite(mealId) {
    try {
      const favoriteRef = ref(database, `favorites/${mealId}`);
      const snapshot = await get(favoriteRef);
      return snapshot.exists();
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Get all favorites
  async getAllFavorites() {
    try {
      const snapshot = await get(this.favoritesRef);
      if (snapshot.exists()) {
        const favoritesData = snapshot.val();
        return Object.values(favoritesData).sort((a, b) => 
          new Date(b.dateAdded) - new Date(a.dateAdded)
        );
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  // Listen to favorites changes in real-time
  onFavoritesChange(callback) {
    const unsubscribe = onValue(this.favoritesRef, (snapshot) => {
      if (snapshot.exists()) {
        const favoritesData = snapshot.val();
        const favorites = Object.values(favoritesData).sort((a, b) => 
          new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        callback(favorites);
      } else {
        callback([]);
      }
    });

    return unsubscribe;
  }

  // Stop listening to favorites changes
  offFavoritesChange() {
    off(this.favoritesRef);
  }

  // Toggle favorite status
  async toggleFavorite(recipe) {
    try {
      const isCurrentlyFavorite = await this.isFavorite(recipe.idMeal);
      
      if (isCurrentlyFavorite) {
        await this.removeFromFavorites(recipe.idMeal);
        return false;
      } else {
        await this.addToFavorites(recipe);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
}

export default new FavoritesService();
