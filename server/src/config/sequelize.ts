// src/database/connection.ts
import { Sequelize } from 'sequelize';
require('dotenv').config();

// Define the interface for each environment configuration
interface DBConfig {
  username: string;
  password?: string;  // Allow password to be undefined instead of null
  database: string;
  host: string;
  port?: number;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mssql';  // Specify allowed dialect types for safety
  dialectOptions?: {
    ssl?: {
      ca?: Buffer;
    };
  };
}

// Define the full structure of the config object
interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
}

// Import the config.js file
const config: Config = require('./config.js');

// Determine the current environment
const env = (process.env.NODE_ENV || 'development') as keyof Config;
console.log(env);

// Get the database configuration for the current environment
const dbConfig = config[env];

// Initialize Sequelize using the current environment's configuration
const db = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password ?? '', {  // Handle password being null
  host: dbConfig.host,
  dialect: dbConfig.dialect as any, // Cast `dialect` to `any` if TypeScript complains
  logging: false,
  dialectOptions: {
    connectTimeout: 20000, // 20 seconds timeout
    ...dbConfig.dialectOptions, // Include the dialect options, if any
  },
  port: dbConfig.port,
});

export default db;