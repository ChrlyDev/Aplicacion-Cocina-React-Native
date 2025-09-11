const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const mealAPI = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get meals by category
  getMealsByCategory: async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
      const data = await response.json();
      return data.meals;
    } catch (error) {
      console.error('Error fetching meals by category:', error);
      throw error;
    }
  },

  // Get meal details by ID
  getMealById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error('Error fetching meal details:', error);
      throw error;
    }
  },

  // Search meals by name
  searchMeals: async (query) => {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error searching meals:', error);
      throw error;
    }
  },

  // Get random meal
  getRandomMeal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error('Error fetching random meal:', error);
      throw error;
    }
  }
};
