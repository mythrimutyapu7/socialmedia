require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const connectionRoutes = require('./routes/connections');
app.use('/api/connections', connectionRoutes);




// simple test route
app.get('/', (req, res) => res.send('Backend is running'));

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || '';

// Start DB and server
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error:', err.message);
    // Start server anyway if no DB (useful for early-stage testing)
    app.listen(PORT, () => console.log(`Server started on port ${PORT} (no DB)`));
  });
