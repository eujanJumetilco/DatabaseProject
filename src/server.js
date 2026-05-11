import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import contactRoutes from './routes/contactRoutes.js';
import medicalInformationRoutes from './routes/medicalInformationRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/medical-information', medicalInformationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express.js API' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });