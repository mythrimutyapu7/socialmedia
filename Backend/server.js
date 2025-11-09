require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Allow local + deployed frontend
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://socialmedia-2al9.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const connectionRoutes = require('./routes/connections');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connections', connectionRoutes);

// ✅ Test route
app.get('/', (req, res) => res.send('Backend is running 🚀'));

// ✅ Database connection
const MONGO = process.env.MONGO_URI || '';
mongoose
  .connect(MONGO)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('DB connection error:', err.message));

// ✅ Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running locally on port ${PORT} 🚀`)
  );
}

// ✅ Export handler for Vercel
module.exports = (req, res) => {
  return app(req, res);
};
