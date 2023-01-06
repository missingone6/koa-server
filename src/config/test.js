import { getHValue, initRedis, setValue } from "./RedisConfig";
initRedis();
// setValue('testkey3', {
//   name: 'lyl',
//   age: 18
// });

getHValue('testkey3').then(v => console.log(v))