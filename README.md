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

## Documentation
API documentation is available at:
- [Live API Documentation](https://case-backend.vercel.app/api-docs)
- Local documentation at `/api-docs` when server is running

## API Endpoints

### Live API Endpoints

#### Recipes
- [Get all recipes](https://case-backend.vercel.app/api/recipes)
- [Get recipes by category (main-course)](https://case-backend.vercel.app/api/recipes?categoryId=main-course)
- [Get recipe details (Karnıyarık)](https://case-backend.vercel.app/api/recipes/1)

#### Categories
- [Get all categories](https://case-backend.vercel.app/api/categories)

### API Routes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes?categoryId={categoryId}` - Get recipes by category
- `GET /api/recipes/{id}` - Get recipe details
- `GET /api/categories` - Get all categories

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

## Tech Stack
- Express.js
- TypeScript
- Swagger UI