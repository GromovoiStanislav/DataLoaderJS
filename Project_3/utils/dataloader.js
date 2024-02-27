import DataLoader from 'dataloader';
import { client } from './redis.js';

export const redisLoader = new DataLoader(async (keys) => {
  try {
    const results = await client.mGet(keys);
    return results.map((result, index) =>
      result !== null ? result : new Error(`No key: ${keys[index]}`)
    );
  } catch (error) {
    throw error;
  }
});
