const log4js = require("log4js");
log4js.configure({
  appenders: { traser: { type: "file", filename: "error.log" } },
  categories: { default: { appenders: ["traser"], level: "error" } },
});
const logger = log4js.getLogger("traser");

module.exports = logger;
