const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const router = require('./Routes/Routes');
const pr = require('./Routes/productRoutes');
const com = require('./Routes/comments');
require('dotenv').config();

app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://explorepricing.com',
      'https://www.explorepricing.com',
      'https://ecomerce-mern-royo.vercel.app',
      'https://ecomerce-1-2b9c.vercel.app'
    ];
    
    // If origin is allowed or if no origin (non-browser requests), proceed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow cookies and credentials
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Routes
app.use('/product', router);
app.use('/pro', pr);
app.use('/comments', com);

// Root route for testing the server
app.get('/', async (req, res) => {
  res.json('hi');
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected');
    app.listen(8081, () => console.log('Server is running on port 8081'));
  })
  .catch(err => {
    console.error('Failed to connect to the database', err);
  });
