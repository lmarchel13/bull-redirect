const Queue = require("bull");

const redisHost = { port: 6379, host: "127.0.0.1" };

const queue = new Queue("queue", { redis: redisHost });

console.log("starting process", process.pid);

const acceptOrRedirect = () => {
  return Math.round(Math.random() * 100) > 50;
};

const redirect = (job) => {
  console.log("REDIRECTING JOB ID =>", job.id);
  queue.add(
    { ...job.data, redirect: true, redirectedFrom: process.pid },
    {
      jobId: job.id,
      attempts: 99999,
      backoff: {
        type: "botConnector",
      },
    }
  );
};

queue.process((job, done) => {
  console.log("job received", { processId: process.pid, jobId: job.id });

  if (acceptOrRedirect() && job.data.redirectedFrom !== process.pid) {
    const isJobRedirect = job.data && job.data.redirect;

    console.log("job accepted");

    if (isJobRedirect) {
      console.log({ isJobRedirect, redirectedFrom: job.data.redirectedFrom });
    }

    setTimeout(() => {
      done();
      console.log("job done\n");
    }, 5000);
  } else {
    console.log("job rejected >>> redirecting\n");
    redirect(job);
    done();
  }
});
