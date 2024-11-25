const Redis              = require('redis');
const DEFAUTL_EXPIRATION = 3600;

const redisClient = Redis.createClient(
  process.env.NODE_ENV == "development" ? 6379 : {url:'redis://client:6379'}
);

// redis client setup
const main = async () => {
  redisClient.on('error', err => console.log('Redis Client Error', err));
  redisClient.on('ready', () => console.log("Redis Connected"));
  await redisClient.connect();
}
main();

// redis cache middleware
async function getOrSetCache(key ,cb, exp = DEFAUTL_EXPIRATION){
  try {
    const data = await redisClient.get(key);
    if(data!= null) return JSON.parse(data);
    const freshData = await cb();
    await redisClient.setEx(key, exp, JSON.stringify(freshData));
    return freshData;
  } catch (error) {
    console.error(error);
    throw error;
  } 
}

module.exports = { getOrSetCache }