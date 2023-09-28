const DataLoader = require('dataloader');
const axios = require('axios');

// Создаем загрузчик с функцией загрузки данных
const myLoader = new DataLoader((keys) => batchLoadData(keys));
// const myLoader = new DataLoader((keys) => batchLoadData(keys), {cache: false,}); // без кэша. myLoader.prime - не будет работать

// Функция, которая загружает данные по ключам
async function batchLoadData(keys) {
  const results = await Promise.all(keys.map((key) => fetchDataFromApi(key)));
  return results;
}

// Функция для загрузки данных с помощью Axios
async function fetchDataFromApi(key) {
  console.log('Делаем запрос...');
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${key}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при загрузке данных для ключа ${key}: ${error.message}`
    );
    throw error;
  }
}

// Используем загрузчик для запроса данных
(async () => {
  let data = await myLoader.load(1); // Первый запрос, данные будут загружены из сети (Axios)
  console.log(data);
  console.log('/n');

  data = await myLoader.load(1); // Второй запрос с тем же ключом, данные будут взяты из кэша
  console.log(data);
  console.log();

  // Используем загрузчик для запроса данных для нескольких ключей
  data = await myLoader.loadMany([1, 2, 3]); // Здесь передаем массив ключей
  console.log(data); // Выводим результат загрузки данных
  console.log();

  // Предварительно загружаем данные для ключа 999
  myLoader.prime(999, { id: 999, name: 'Пример данных для ключа 1' });
  data = await myLoader.load(999); //  данные будут взяты из кэша
  console.log(data);
  console.log();

  //myLoader.clear(1); //удаления данных из кэша по указанному ключу
  myLoader.clearAll(); // очистка всего кэша
  data = await myLoader.load(1); //  данные будут из запроса
  console.log(data);
  console.log();
})();
