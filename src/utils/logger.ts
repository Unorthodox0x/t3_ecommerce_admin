import moment from "moment";
import winston from "winston";

let ready = false;
let interval = null;
let winstonLogger = null;
const logMode = process.env.LOG_MODE || "console";
const logLevelOfFile = process.env.LOG_LEVEL_OF_FILE || "error";
const logLevelOfInfo = process.env.LOG_LEVEL_OF_CONSOLE || "debug";
const logFolder = process.env.LOG_FOLDER || "logs";

function initWinstonLogger() {
  const options = {
    file: {
      level: logLevelOfFile,
      filename: `${logFolder}/${moment().format("YYYY.MM.DD")}.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.prettyPrint(),
        winston.format.printf((info) => writeFormat({ isFileLog: true, info }))
      ),
    },
    console: {
      level: logLevelOfInfo,
      prettyPrint: true,
      json: false,
      colorize: true,
      silent: false,
      timestamp: false,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.prettyPrint(),
        winston.format.printf((info) => writeFormat({ isFileLog: false, info }))
      ),
    },
  };

  winstonLogger = winston.createLogger({
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      silly: 4,
    },
    transports:
      logMode === "console"
        ? [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console),
          ]
        : [new winston.transports.Console(options.console)],
  });
}

export function init() {
  try {
    initWinstonLogger();

    if (logMode == "file") {
      console.log(
        `The logging mode to file is enabled. Logging level ${logLevelOfFile}, Path: ${logFolder}`
      );
    }
    if (logMode == "console") {
      console.log(
        `The logging mode to console is enabled. Logging level ${logLevelOfInfo}, Path: ${logFolder}`
      );
    }
    ready = true;
    // Initialization of the logger restart function (every hour)
    interval = setInterval(initWinstonLogger, 3600000);
  } catch (e) {
    console.log(e);
    throw new Error(`Logging module initialization error: ${e.toString()}`);
  }
}

const writeLog = (err) => {
  const logLabel = err.error
    ? "ERROR"
    : err.warn
    ? "WARNING"
    : err.info
    ? "INFO"
    : err.debug
    ? "DEBUG"
    : err.trace
    ? "TRACE"
    : "TRACE";

  if (typeof err == "object") err = JSON.stringify(err, null, 2);

  if (!winstonLogger) {
    return;
  }

  if (logLabel == "ERROR") winstonLogger.error(err);
  if (logLabel == "WARNING") winstonLogger.warn(err);
  if (logLabel == "INFO") winstonLogger.info(err);
  if (logLabel == "DEBUG") winstonLogger.debug(err);
  if (logLabel == "TRACE") winstonLogger.silly(err);

  return err;
};

// Error write function
const writeFormat = ({ isFileLog, info }) => {
  try{
    // log information
    let { timestamp, level, message, ...args } = info;
    // Replace silly to trace
    if (level.indexOf("silly") > -1) level = level.replace("silly", "trace");
    // log time
    let ts = moment(timestamp, "YYYY-MM-DDTHH:mm:ss").toISOString(true);
    // log message
    message =
      isFileLog && typeof message == "object"
        ? JSON.stringify(JSON.parse(message))
        : message;
    let msg = `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args) : ""
    } `;
    return msg;
  }catch(err){
    console.log('err', err)
  }
};

export function error(msg, data = null) {
  try{
    writeLog({ error: msg, data });
  }catch(logErr){
    console.log('logErr', logErr)
  }
}

export function warn(msg, data = null) {
  try{
    writeLog({ warn: msg, data });
  }catch(warnErr){
    console.log('warnErr', warnErr)
  }
}

export function info(msg, data = null) {
  try{
  writeLog({ info: msg, data });
  }catch(infoErr){
    console.log('infoErr', infoErr)
  }
}

export function debug(msg, data = null) {
  try{
    writeLog({ debug: msg, data });
  }catch(debugErr){
      console.log('debugErr', debugErr)
  }
}
export function trace(msg, data = null) {
  try{
    writeLog({ trace: msg, data });
  }catch(traceErr){
      console.log('traceErr', traceErr)
  }
}