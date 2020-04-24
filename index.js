const Queue = require("bull");

const redisHost = { port: 6379, host: "127.0.0.1" };

const queue = new Queue("queue", { redis: redisHost });

console.log("starting process", process.pid);

const acceptOrRedirect = () => {
  return Math.round(Math.random() * 100) > 30;
};

const redirect = (job) => {
  queue.add({ ...job.data, jobRedirectId: job.id, redirect: true, redirectedFrom: process.pid });
};

queue.process((job, done) => {
  console.log(`job id ${job.id} received at process ${process.pid}`);

  if (acceptOrRedirect() && job.data.redirectedFrom !== process.pid) {
    const isJobRedirect = job.data && job.data.redirect;

    console.log("job accepted");
    if (isJobRedirect) {
      console.log({ isJobRedirect, redirectJobId: job.data.jobRedirectId, from: job.data.redirectedFrom });
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
