const http = require('http');
const app = require('./app');
const port = 8080;
const server = http.createServer(app);
const twitterController = require('./api/controller/twitterController');
const wordsConfig = require('./config/words');
const bpiController = require('./api/controller/bpiController')
const chartDao = require('./api/dao/chartDao');
/**
 * make a log directory, just in case it isn't there.
 */
try {
  require('fs').mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

var log4js = require('log4js');
var logConfig = require('./config/log4js')
log4js.configure(logConfig);


var logData = function (err, data) {
  if (err) {
    console.error(err)
  }
  else {
    console.log(data);
  }
}
setInterval(function () {
  for (i = 0; i < wordsConfig.currency.length; i++) {
    console.log(wordsConfig.currency[i]);
    twitterController.pullDataFromTwitter(wordsConfig.currency[i], logData);
  }
}, 60000);

setInterval(function () {
  bpiController.getCurrentBpi(logData);
}, 60000);

setInterval(function () {
  var data = {
    timeFilter: '5 minutes'
  }
  chartDao.calculatingAction(data, logData);
}, 60000);
server.listen(port);
console.log(" Server Started ");
