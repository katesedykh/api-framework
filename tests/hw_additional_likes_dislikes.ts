import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import LikeApi from "../src/http/LikeApi";


const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
let randCat;


describe('Проверка лайков', async () => {
  const n = 2;
  let likes;
  it('Получение случайного кота', async () => {
    console.info('Получение случайного кота');
    //Получение всех котиков
    const getAllCats = await CoreApi.getAllCats();

    allure.step(`Получены все котики`,  () => {
      assert.equal(getAllCats.status, 200);
    });
    //Получение одного случайного котика из всех полученных
    //1. Получение рандомной группы из всех
    const group = getRandomInt(getAllCats.data.groups.length);
    //2. Получение рандомного котика из полученной рандомной группы
    const randCat = getAllCats.data.groups[group].cats[getRandomInt(getAllCats.data.groups[group].cats.length)];
    const CatData = JSON.stringify(randCat, null, 2);
  
    console.info(`Котик c id = ${randCat.id}) успешно получен`);

    allure.logStep(`Выбран случайный котик`);
    allure.testAttachment(`Полученный котик`, CatData, `application/json`);
  });
  
  it('Получение количества лайков', async () => {
    const getCat = await CoreApi.getCatById(randCat.id);

    const likes = getCat.data.cat.likes;
    console.info(`У котика ${likes} likes`);
    allure.logStep(`У котика ${likes} likes`);
    assert.equal(getCat.status, 200);
  });


  it('Добавление лайков', async () => {
    //Добавление котику n лайков
    for (let i = 1; i<=n; i++) {
      const addLikes = await LikeApi.likes(randCat.id, {like: true, dislike: false});
      assert.equal(addLikes.status, 200);
    }
    
    console.info(`Котику добавлен(о) ${n} лайк(ов)`);
    likes = likes + n;
    allure.logStep(`Котику добавлен(о) ${n} лайк(ов)`);

  });  
  
  it('Проверка выставленного лайка', async () => {
    //Получение котика по айди, проверка соответсвия лайков с ожидаемым результатом
    const getCat = await CoreApi.getCatById(randCat.id);

    allure.logStep(`Получен котик с id = ${randCat.id}, количество лайков =  ${JSON.stringify(getCat.data.cat.likes, null, 2)} ` );
    allure.testAttachment('Получен котик с количеством лайков = ', JSON.stringify(getCat.data.cat.likes, null, 2), 'application/json');

    assert.equal(getCat.data.cat.likes, likes, 'Количество лайков не соответсвует');
    console.info(`Обновлённое количество лайков: ${likes}`);
  });
  

});



describe('Проверка дизлайков', async () => {
  const m = 5
  let dislikes; 
  it('Получение случайного кота', async () => {
    console.info('Получение случайного кота');
    //Получение всех котиков
    const getAllCats = await CoreApi.getAllCats();

    allure.step(`Получены все котики`,  () => {
      assert.equal(getAllCats.status, 200);
    });

    //Получение одного случайного котика из всех полученных
    //1. Получение рандомной группы из всех
    const group = getRandomInt(getAllCats.data.groups.length);
    //2. Получение рандомного котика из полученной рандомной группы
    const randCat = getAllCats.data.groups[group].cats[getRandomInt(getAllCats.data.groups[group].cats.length)];
    const CatData = JSON.stringify(randCat, null, 2);

    console.info(`Котик c id = ${randCat.id}) успешно получен`);

    allure.logStep(`Выбран случайный котик`);
    allure.testAttachment(`Полученный котик`, CatData, `application/json`);
  });

  it('Получение количества дизлайков', async () => {
    const getCat = await CoreApi.getCatById(randCat.id);

    const dislikes = getCat.data.cat.dislikes;
    console.info(`У котика ${dislikes} dislikes`);
    allure.logStep(`У котика ${dislikes} dislikes`);
    assert.equal(getCat.status, 200);
  });


  it('Добавление лайков', async () => {
    //Добавление котику m дизлайков
    for (let i = 1; i<=m; i++) {
      const addDislikes = await LikeApi.likes(randCat.id, {like: false, dislike: true});
      assert.equal(addDislikes.status, 200);
    }
  
    console.info(`Котику добавлен(о) ${m} дизлайк(ов)`);
    dislikes = dislikes + m;
    allure.logStep(`Котику добавлен(о) ${m} дизлайк(ов)`);

  });  

  it('Проверка выставленного лайка', async () => {
  //Получение котика по айди, проверка соответсвия лайков с ожидаемым результатом
  const getCat = await CoreApi.getCatById(randCat.id);

  allure.logStep(`Получен котик с id = ${randCat.id}, количество дизлайков =  ${JSON.stringify(getCat.data.cat.dislikes, null, 2)}`);
  allure.testAttachment('Получен котик с количеством дизлайков = ', JSON.stringify(getCat.data.cat.dislikes, null, 2), 'application/json');

  assert.equal(getCat.data.cat.dislikes, dislikes, 'Количество дизлайков не соответсвует');
  console.info(`Обновлённое количество дизлайков: ${dislikes}`);
  });

});
  