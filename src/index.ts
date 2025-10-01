import express from 'express';
import cors from 'cors';
import path from 'path';
import { RecipeService } from './services/recipeService';
import { CategoryService } from './services/categoryService';
import { UserService } from './services/userService';
import { DatabaseService } from './services/databaseService';

const app = express();
const PORT = process.env.PORT || 3000;
const recipeService = new RecipeService();
const categoryService = new CategoryService();
const userService = new UserService();
// Initialize database on startup
DatabaseService.getInstance();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve Swagger UI
app.get('/api-docs', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Turkish Recipe API - Swagger UI</title>
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.css">
      <style>
        .topbar { display: none }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = () => {
          const ui = SwaggerUIBundle({
            url: '/swagger.yaml',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
          window.ui = ui;
        };
      </script>
    </body>
    </html>
  `);
});

// Serve swagger.yaml
app.get('/swagger.yaml', (_req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.sendFile(path.join(__dirname, '../swagger.yaml'));
});
app.use(express.json());

// Serve static files from the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// ===== Authentication Routes =====

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, birthday } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password, and name are required' 
      });
    }

    const userProfile = await userService.register({ email, password, name, birthday });
    
    res.status(201).json({
      user: userProfile,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Email already exists') {
        return res.status(409).json({ message: error.message });
      }
      if (error.message.includes('Invalid') || error.message.includes('required') || error.message.includes('must be')) {
        return res.status(400).json({ message: error.message });
      }
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    const userProfile = await userService.login({ email, password });
    
    res.status(200).json({
      user: userProfile,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get profile endpoint
app.get('/api/auth/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const userProfile = userService.getProfile(userId);
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    
    if (error instanceof Error && error.message === 'Invalid user ID format') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== Recipe Routes =====

// Get all recipes
app.get('/api/recipes', (req, res) => {
  try {
    const filters = {
      categoryId: req.query.categoryId as string,
      keyword: req.query.keyword as string
    };
    const result = recipeService.getRecipes(filters);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get recipe by ID
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
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all categories
app.get('/api/categories', (_req, res) => {
  try {
    const result = categoryService.getCategories();
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
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