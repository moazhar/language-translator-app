const redis = require('redis');

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

const getData = (key) => new Promise((resolve, reject) => {
  redisClient.lrange(key, 0, -1, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});

const postData = (key, value) => new Promise((resolve, reject) => {
  redisClient.rpush(key, value, (err, data) => {
    if (err) {
      reject(err);
    }
    redisClient.expire(key, 120);
    resolve(data);
  });
});

module.exports = {
  getData,
  postData,
};
