const Queue = require("bull");

const redisHost = { port: 6379, host: "127.0.0.1" };

const queue = new Queue("queue", { redis: redisHost });

let id = 1;
setInterval(() => {
  console.log("send job to queue...");
  queue.add({ id, message: `hello` });
  id++;
}, 4000);
