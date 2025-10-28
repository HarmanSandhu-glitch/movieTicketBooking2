import mongoose from "mongoose";
import { config } from './config.js';
import logger from '../utils/logger.js';

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully', {
    host: mongoose.connection.host,
    database: mongoose.connection.name,
  });
});
mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error', { error: error.message });
});
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Database connection established', {
      uri_type: config.DB_URL ? 'DB_URL' : 'MONGO_URI',
      host: mongoose.connection.host,
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error.message,
      uri_type: config.DB_URL ? 'DB_URL' : 'MONGO_URI',
    });
    process.exit(1);
  }
}
export default connectDB;
