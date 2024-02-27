import { client } from './utils/redis.js';
import { redisLoader } from './utils/dataloader.js';

const loadDataToRedis = async () => {
  // Предположим, что у вас есть массив пар ключ-значение для сохранения в Redis
  const keyValuesToSave = [
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
    { key: 'key3', value: 'value3' },
  ];

  // Сохраните значения в Redis с использованием метода mset
  const redisData = keyValuesToSave.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  await client.mSet(redisData);
};

const getData = () => {
  // Предположим, что у вас есть ключ, для которого вы хотите получить значение
  const keysToFetch = ['key1', 'key2', 'key3'];
  redisLoader
    .loadMany(keysToFetch)
    .then((results) => {
      // Обработайте полученные результаты
      console.log('Results:', results);
    })
    .catch((error) => {
      // Обработайте ошибку, если что-то пошло не так
      console.error('Error:', error.message);
    });

  // Предположим, что у вас есть ключ, для которого вы хотите получить значение
  const keyToFetch = 'key1';
  redisLoader
    .load(keyToFetch)
    .then((result) => {
      // Обработайте полученное значение
      console.log('Result:', result);
    })
    .catch((error) => {
      // Обработайте ошибку, если что-то пошло не так
      console.error('Error:', error.message);
    });
};

await loadDataToRedis();

getData();
