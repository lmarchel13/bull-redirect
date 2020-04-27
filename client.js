const Queue = require("bull");

const redisHost = { port: 6379, host: "127.0.0.1" };

const queue = new Queue("queue", {
  redis: redisHost,
  settings: {
    backoffStrategies: {
      botConnector: function () {
        return 100;
      },
    },
  },
});

let id = 1;
setInterval(() => {
  const jobId = `myjobid:${id}`;
  console.log("send job to queue...", { jobId });

  queue.add(
    { id, message: `hello` },
    {
      jobId,
      attempts: 99999,
      backoff: {
        type: "botConnector",
      },
    }
  );

  id++;
}, 4000);
