const Queue = require("bull");

const redisHost = { port: 6379, host: "127.0.0.1" };

module.exports = new Queue("queue", {
  redis: redisHost,
  settings: {
    backoffStrategies: {
      botConnector: function (attempsMade, err) {
        if (err.name === "REDIRECTING_JOB") return 100;

        return -1;
      },
    },
  },
});
