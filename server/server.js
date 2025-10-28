import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import { config } from './configs/config.js';
import logger from './utils/logger.js';
import routes from './routes/index.js';

const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};
dotenv.config();
const app = express();

const corsOptions = {
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(
  config.nodeEnv === 'development' ? 'dev' : 'combined',
  {
    stream: morganStream,
    skip: (req, res) => {
      if (config.nodeEnv === 'production' && req.path === '/') {
        return true;
      }
      return false;
    }
  }
));

await connectDB();

app.get('/', (req, res) => {
  res.json({
    message: 'Movie Ticket Booking System API',
    status: 'running',
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

app.use(config.apiPrefix, routes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


app.use((err, req, res, next) => {
  logger.error('Unhandled error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

app.listen(config.port, () => {
  logger.info('🚀 Movie Ticket Booking System started successfully', {
    port: config.port,
    environment: config.nodeEnv,
    apiPrefix: config.apiPrefix,
  });
  logger.info(`Server running on http://localhost:${config.port}`);
  logger.info(`API available at http://localhost:${config.port}${config.apiPrefix}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});
