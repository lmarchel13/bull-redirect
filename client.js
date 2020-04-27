const queue = require("./queue");

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
