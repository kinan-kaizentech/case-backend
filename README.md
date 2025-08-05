# Turkish Recipe API

Simple REST API for Turkish recipes. Built with Express.js and TypeScript.

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## API Endpoints

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes?categoryId=main-course` - Get recipes by category
- `GET /api/recipes/1` - Get recipe details

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/main-course` - Get category details

## Categories
- `main-course` - Main Dishes
- `soup` - Soups
- `meze` - Appetizers
- `dessert` - Desserts
- `breakfast` - Breakfast Items
- `pastry` - Pastries
- `vegetarian` - Vegetarian Dishes
- `rice-pasta` - Rice and Pasta Dishes

## Example Recipes
1. Karnıyarık
2. Mercimek Çorbası
3. Yaprak Sarma
4. İskender Kebap
5. Sütlaç
6. Menemen
7. Su Böreği
8. Pilav
9. Patlıcan Musakka
10. İmam Bayıldı

## Documentation
API documentation is available at `/api-docs` when server is running.

## Tech Stack
- Express.js
- TypeScript
- Swagger UI