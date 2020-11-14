const http = require("http");
const { pipeline } = require("stream");
const fs = require("fs");
const dayjs = require("dayjs");
const schedule = require("node-schedule");
const objectSupport = require("dayjs/plugin/objectSupport");
const duration = require("dayjs/plugin/duration");
dayjs.extend(objectSupport);
dayjs.extend(duration);

const duree = dayjs.duration({ hours: 3 }).asMilliseconds();

let job = schedule.scheduleJob(
  { hour: 17, minute: 0, dayOfWeek: 6 },
  function () {
    const file = fs.createWriteStream("./la_fievre.mp3");

    console.log("allo");
    let req = http.get(
      "http://stream.statsradio.com:8088/stream",
      (response) => {
        let pipe = pipeline(response, file, (err) => {
          if (err) console.error("Pipeline failed.", err);
          else console.log("Pipeline succeeded.");
        });

        setTimeout(() => {
          pipe.end();
          job.cancel();
        }, duree);
      }
    );
  }
);