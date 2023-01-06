import TestModel from './test';

// 增

const insert = async () => {
  const data = new TestModel({
    name: 'insert',
    age: 10,
  });
  const result = await data.save();
  console.log(result);
}


insert();