# Firebase Realtime Database - Favoritos Setup

## Configuración Implementada

Se ha implementado Firebase Realtime Database para la funcionalidad de favoritos en la aplicación de recetas.

### Archivos Creados/Modificados:

1. **`config/firebase.js`** - Configuración de Firebase
2. **`services/favoritesService.js`** - Servicio para manejar favoritos
3. **`screens/FavoritesScreen.js`** - Pantalla de favoritos
4. **`screens/RecipeDetailScreen.js`** - Agregado botón de favoritos
5. **`screens/SearchScreen.js`** - Agregado acceso a favoritos
6. **`App.js`** - Agregada navegación a favoritos

### Funcionalidades Implementadas:

#### ✅ Agregar/Quitar Favoritos
- Botón de corazón en la pantalla de detalle de recetas
- Toggle entre ❤️ (favorito) y 🤍 (no favorito)
- Confirmación visual al agregar/quitar

#### ✅ Pantalla de Favoritos
- Lista de todas las recetas favoritas
- Información de cada receta (nombre, categoría, origen, fecha agregada)
- Navegación directa al detalle de la receta
- Opción para eliminar favoritos con confirmación
- Estado vacío con botón para explorar recetas

#### ✅ Navegación
- Botón de favoritos (❤️) en el header de pantallas principales
- Acceso desde Categories, RecipeList y Search screens

#### ✅ Tiempo Real
- Actualizaciones automáticas cuando se agregan/quitan favoritos
- Sincronización entre pantallas

### Estructura de Datos en Firebase:

```json
{
  "favorites": {
    "52772": {
      "idMeal": "52772",
      "strMeal": "Teriyaki Chicken Casserole",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      "strCategory": "Chicken",
      "strArea": "Japanese",
      "dateAdded": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Servicios Disponibles:

#### `favoritesService.js`
- `addToFavorites(recipe)` - Agregar receta a favoritos
- `removeFromFavorites(mealId)` - Quitar receta de favoritos
- `isFavorite(mealId)` - Verificar si es favorito
- `getAllFavorites()` - Obtener todos los favoritos
- `toggleFavorite(recipe)` - Toggle estado de favorito
- `onFavoritesChange(callback)` - Escuchar cambios en tiempo real

### Configuración Firebase:

La configuración está en `config/firebase.js` con:
- Realtime Database habilitada
- URL de la base de datos configurada
- Exportación de la instancia de database

### Cómo Usar:

1. **Agregar Favorito:**
   - Ir al detalle de una receta
   - Tocar el botón de corazón (🤍)
   - Se convierte en ❤️ y se guarda en Firebase

2. **Ver Favoritos:**
   - Tocar el botón ❤️ en cualquier pantalla principal
   - Ver lista completa de favoritos

3. **Quitar Favorito:**
   - Desde el detalle: tocar ❤️ para convertir a 🤍
   - Desde favoritos: tocar 🗑️ y confirmar

### Características Técnicas:

- **Tiempo Real:** Usa Firebase Realtime Database listeners
- **Persistencia:** Los favoritos se mantienen entre sesiones
- **Optimización:** Verificación de estado antes de operaciones
- **UX:** Indicadores de carga y confirmaciones
- **Error Handling:** Manejo de errores con alertas informativas

### Testing:

Para probar la funcionalidad:
1. Ejecutar la aplicación
2. Navegar a cualquier receta
3. Agregar/quitar favoritos
4. Verificar que aparecen en la pantalla de favoritos
5. Comprobar persistencia cerrando y abriendo la app
