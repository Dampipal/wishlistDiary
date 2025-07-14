import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase  from './config/db.js';
import wishRoutes from './route/wishlistRoutes.js';
import userRoutes from './route/userRoutes.js';
import authRoutes from './route/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 9002;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectToDatabase();

app.use('/api/wishlists', wishRoutes);
app.use('/api/users', userRoutes);  
app.use('/api/auth', authRoutes);

// Example route for user registration
app.get('/api/health', (req, res) => {
  res.send('API is running smoothly! ...');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ⏱ Self-Ping Logic
if (process.env.PING_URL) {
  setInterval(() => {
    fetch(process.env.PING_URL)
      .then(res => console.log(`🔁 Self-ping success: ${res.status}`))
      .catch(err => console.error('❌ Self-ping failed:', err.message));
  }, 10 * 60 * 1000); // Every 2 minutes
}