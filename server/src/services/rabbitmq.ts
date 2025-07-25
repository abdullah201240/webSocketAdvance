import amqp, { ChannelModel } from 'amqplib';
import type { Channel, ConsumeMessage, Options } from 'amqplib';

// Configuration
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const RECONNECT_DELAY_MS = 5000; // 5 seconds between connection attempts

// State with explicit types
let connection: ChannelModel | null = null;
let channel: Channel | null = null;
let isConnecting = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

// Connection management with proper typing
const connectRabbitMQ = async (): Promise<Channel> => {
  if (channel) return channel;
  if (isConnecting) {
    return new Promise<Channel>((resolve) => {
      const checkInterval = setInterval(() => {
        if (channel) {
          clearInterval(checkInterval);
          resolve(channel);
        }
      }, 100);
    });
  }

  isConnecting = true;
  try {
    console.log('Connecting to RabbitMQ...');
    const conn = await amqp.connect(RABBITMQ_URL);
    connection = conn;
    reconnectAttempts = 0;

    connection!.on('close', () => {
      console.log('RabbitMQ connection closed, attempting to reconnect...');
      handleReconnect();
    });

    connection!.on('error', (err: Error) => {
      console.error('RabbitMQ connection error:', err.message);
    });

    channel = await connection!.createChannel();
    channel!.on('error', (err: Error) => {
      console.error('RabbitMQ channel error:', err.message);
    });

    console.log('Successfully connected to RabbitMQ');
    isConnecting = false;
    return channel;
  } catch (error) {
    isConnecting = false;
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

const handleReconnect = async (): Promise<void> => {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error('Max reconnection attempts reached, giving up');
    return;
  }

  reconnectAttempts++;
  console.log(`Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`);

  try {
    await closeRabbitMQ();
    await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY_MS));
    await connectRabbitMQ();
  } catch (error) {
    console.error('Reconnection failed:', error);
    setTimeout(handleReconnect, RECONNECT_DELAY_MS);
  }
};

// Core functions with proper typing
export const publishToQueue = async (
  queue: string,
  message: unknown,
  options: Options.Publish = {}
): Promise<void> => {
  try {
    const ch = await connectRabbitMQ();
    await ch.assertQueue(queue, { durable: true });
    ch.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true, ...options }
    );
  } catch (error) {
    console.error('Failed to publish message:', error);
    throw error;
  }
};

export const consumeQueue = async (
  queue: string,
  onMessage: (msg: ConsumeMessage | null, ch: Channel) => Promise<void>,
  options: Options.Consume = { noAck: false }
): Promise<void> => {
  try {
    const ch = await connectRabbitMQ();
    await ch.assertQueue(queue, { durable: true });
    
    const handleMessage = async (msg: ConsumeMessage | null) => {
      try {
        await onMessage(msg, ch);
      } catch (error) {
        console.error('Error processing message:', error);
        if (msg && !options.noAck) {
          ch.nack(msg, false, true); // Requeue message on error
        }
      }
    };

    ch.consume(queue, handleMessage, options);
  } catch (error) {
    console.error('Failed to set up consumer:', error);
    throw error;
  }
};

// Cleanup with proper typing
export const closeRabbitMQ = async (): Promise<void> => {
  try {
    if (channel) {
      await channel!.close();
      channel = null;
    }
    if (connection) {
      await connection!.close();
      connection = null;
    }
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});