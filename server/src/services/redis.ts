import Redis from 'ioredis';
import { consumeQueue } from './rabbitmq';

const redis = new Redis(); // Defaults to localhost:6379, adjust if needed

// Helper to get cached data
export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

// Helper to set cache with optional expiration (default 60s)
export const setCache = async (key: string, value: any, expireSeconds = 60) => {
  await redis.set(key, JSON.stringify(value), 'EX', expireSeconds);
};

// Helper to delete cache
export const delCache = async (key: string) => {
  await redis.del(key);
};

// Subscribe to RabbitMQ for cache invalidation
export const subscribeToCacheInvalidation = () => {
  consumeQueue('sales_events', async (msg, ch) => {
    if (!msg) return;
    try {
      const event = JSON.parse(msg.content.toString());
      if (['sale_added', 'sale_updated', 'sale_deleted'].includes(event.type)) {
        await delCache('sales:list');
      }
      ch.ack(msg);
    } catch (err) {
      ch.nack(msg, false, false); // discard message on error
    }
  });
};

export default redis; 