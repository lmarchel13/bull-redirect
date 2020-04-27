const queue = require("./queue");

const CONCURRENT_JOBS = 10;

console.log("starting process", process.pid);

const acceptOrRedirect = () => {
  return Math.round(Math.random() * 100) > 30;
};

const jobRedirect = (job) => {
  console.log(`REDIRECTING JOB ID => ${job.id}\n`);
  throw new Error("redirecting");
};

queue.process(CONCURRENT_JOBS, async (job) => {
  console.log("job received", { processId: process.pid, jobId: job.id });

  console.log("data", job.data);
  const { redirect = {} } = job.data;

  if (acceptOrRedirect() && redirect.from !== process.pid) {
    console.log("job accepted");

    const isJobRedirect = job.data && job.data.redirect && job.data.redirect.status;

    if (isJobRedirect) {
      console.log({ isJobRedirect, redirectedFrom: job.data.redirect.from });
    }
  } else {
    console.log(`job ${job.id} rejected >>> redirecting`);
    job.update({ ...job.data, redirect: { status: true, from: process.pid } });

    jobRedirect(job);
  }
});
