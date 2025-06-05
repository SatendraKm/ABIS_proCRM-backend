// Initialize dotenv to load environment variables
import dotenv from 'dotenv';
dotenv.config();

// all the imports are done here
import express from 'express';
import cors from 'cors';
import { sequelize } from './configs/sequelize';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';

// Create an Express application
const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS for all origins (customize as needed)
app.use(
  cors({
    origin: true, // or specify your frontend URL, e.g. 'http://localhost:3000'
    credentials: true,
  })
);

// importing routes here
import userRoutes from './routes/userRoutes';

// using the imported routes
app.use('/api/user', userRoutes);

// A simple route to check if the server is running
app.get('/', (_req, res) => {
  res.send('"ABIS-PRO CRM" Backend is running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// Start the server and connect to the database
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Use { alter: true } to update the schema without dropping tables
    // If you want to create tables if they don't exist, you can use:
    // await sequelize.sync({ force: true }); // This will drop and recreate tables
    // If you want to create tables only if they don't exist, you can use:
    // await sequelize.sync({ force: false }); // This will not drop existing tables
    // If you want to create tables only if they don't exist, you can use:
    // await sequelize.sync({ force: false });
    // If you want to create tables only if they don't exist, you can use:

    // await sequelize.sync();
    console.log('DB connected');
  } catch (error) {
    console.error('DB connection failed:', error);
  }
  console.log(`Server running on port ${PORT}`);
});
