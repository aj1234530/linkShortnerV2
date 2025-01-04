// write updata to the db
import { CronJob } from "cron";
import { syncRedisToDB } from "./UpdateDbFunction";
const runThisFxn = () => {};
//five args - 1. cron time, 2. fxn to run based on cron time, 3. on stopping the cron job 4. start on creation or not 5. timezone
//we can pass the null if don't want the funxality eg - we omitteled the on complet fxn , timezone


export const job = new CronJob(
  "* * * * * *", // Run every 5 minutes
  syncRedisToDB,
  () => console.log("job stopped"),
  false, // Do not start the job immediately
  null
);



   
//even after stoppin it will start it

//TOD0 - export to thex index.ts

//notes on cronjob
//1. parameters 2. job.stop() 3. job.start() 4. passing null for param if not needed 5. only arrow fxn signature as  ts ()=>
