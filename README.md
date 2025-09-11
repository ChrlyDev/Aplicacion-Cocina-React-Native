# App de Recetas de Cocina - React Native

Una aplicación móvil desarrollada en React Native que permite explorar recetas de cocina utilizando la API de TheMealDB.

## Características Principales

### Requisitos

1. **Múltiples Pantallas con Navegación**
   - Pantalla de Categorías (inicio)
   - Pantalla de Lista de Recetas
   - Pantalla de Detalles de Receta
   - Pantalla de Búsqueda (funcionalidad adicional)

2. **Categorías con Imágenes**
   - Grid de categorías con imágenes atractivas
   - Navegación intuitiva entre categorías

3. **Lista de Recetas**
   - Muestra recetas con nombre e imagen
   - Filtro de búsqueda local por nombre
   - Layout responsivo en grid

4. **Detalles de Receta**
   - Información completa de preparación
   - Lista de ingredientes con medidas
   - Instrucciones paso a paso
   - Enlaces a videos de YouTube (cuando disponible)
   - Enlace a receta original

5. **API Externa**
   - Integración completa con TheMealDB API
   - Manejo de errores y estados de carga
   - Datos en tiempo real

### 🌟 Funcionalidad Adicional

**Búsqueda Avanzada**
- Búsqueda global de recetas por nombre
- Función de receta aleatoria
- Interfaz dedicada para exploración

## Estructura del Proyecto

```
├── App.js                 # Configuración principal y navegación
├── services/
│   └── api.js            # Servicio para TheMealDB API
├── screens/
│   ├── CategoriesScreen.js    # Pantalla de categorías
│   ├── RecipeListScreen.js    # Lista de recetas por categoría
│   ├── RecipeDetailScreen.js  # Detalles completos de receta
│   └── SearchScreen.js        # Búsqueda y receta aleatoria
└── README.md
```

## Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **React Navigation** - Navegación entre pantallas
- **TheMealDB API** - Fuente de datos de recetas

## Funcionalidades de la API

La aplicación utiliza los siguientes endpoints de TheMealDB:

- `GET /categories.php` - Obtener todas las categorías
- `GET /filter.php?c={category}` - Recetas por categoría
- `GET /lookup.php?i={id}` - Detalles de receta específica
- `GET /search.php?s={query}` - Búsqueda por nombre
- `GET /random.php` - Receta aleatoria

## Características de UI/UX

- **Diseño Moderno**: Interfaz limpia con colores atractivos
- **Navegación Intuitiva**: Botones de retroceso y navegación clara
- **Estados de Carga**: Indicadores visuales durante las peticiones
- **Manejo de Errores**: Mensajes informativos para el usuario
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Imágenes Optimizadas**: Carga eficiente de imágenes de recetas

## Autor

Desarrollado como proyecto académico para Desarrollo de Aplicaciones Móviles - Sexto Semestre
