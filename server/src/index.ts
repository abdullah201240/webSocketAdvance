import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Sale from './routes/sale.routes';
import db from './config/sequelize';
import { errorHandler } from './middlewares/errorHandler';
import { registerSaleSocket } from './services/socket';
import { subscribeToCacheInvalidation } from './services/redis';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8080', 10);
const allowedOrigins = ['http://localhost:3000'];

// Create HTTP server from Express app
const server = createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});
registerSaleSocket(io); // Setup socket connections
// Attach Socket.IO instance to Express app
app.set('io', io);

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Request Origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  })
);

app.use(express.static('public'));
app.use('/api', Sale);
// Serve static files
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Error handler
app.use(errorHandler);

// Start cache invalidation subscriber
subscribeToCacheInvalidation();

// Initialize and start server
const startServer = async () => {
  try {
    await db.authenticate();
    console.log('Database connected successfully!');

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
