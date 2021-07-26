import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';

const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
let randCat;

describe('Проверка функционала удаления котов', async () => {
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

      allure.logStep('Выбран случайный котик');
      allure.testAttachment('Полученный котик', CatData, 'application/json');
    });
  
    it(`Удаление найденного кота`, async () => {
      console.info(`Удаление найденного кота`);
      //Удаление котика по рандомному айди
      const responseDeleteCat = await CoreApi.removeCat(randCat.id);
      const CatData = JSON.stringify(responseDeleteCat.data, null, 2)   
      assert.equal(responseDeleteCat.status, 200);
      console.info(`Котик c id = ${randCat.id}) успешно удален`);

      allure.logStep('Удалён случайный котик');
      allure.testAttachment('Удалённый котик', CatData, 'application/json');
    });
  
  
    it('Проверка, что кот удалён', async () => {
      console.info('Проверка, что кот удалён');

      const responseDeleting = await CoreApi.removeCat(randCat.id);
    
      assert.equal(responseDeleting.status, 404);
      allure.logStep('Повторный запрос удаления, проверка, что котик уже удалён');
      console.info('Проверка закончена');
    });
  

  });
  