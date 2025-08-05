import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { RecipeService } from './services/recipeService';
import { CategoryService } from './services/categoryService';

const app = express();
const PORT = process.env.PORT || 3000;
const recipeService = new RecipeService();
const categoryService = new CategoryService();

// Load Swagger document
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Turkish Recipe API',
      version: '1.0.0',
      description: 'Simple REST API for Turkish recipes'
    },
    servers: [
      {
        url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
        description: 'API Server'
      }
    ]
  },
  apis: ['./src/index.ts']
};

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(helmet());
app.use(express.json());

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: List of recipes
 */
app.get('/api/recipes', (req, res) => {
  try {
    const filters = {
      categoryId: req.query.categoryId as string
    };
    const result = recipeService.getRecipes(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/recipes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    const recipe = recipeService.getRecipeById(id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Category Routes
app.get('/api/categories', (_req, res) => {
  try {
    const result = categoryService.getCategories();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/categories/:id', (req, res) => {
  try {
    const category = categoryService.getCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ data: category });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});