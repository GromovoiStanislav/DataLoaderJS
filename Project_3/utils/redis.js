import 'dotenv/config';
import { createClient } from 'redis';

export const client = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

await client.connect();
