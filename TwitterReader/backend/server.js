const http = require('http');
const app = require('./app');
const port = 8080;
const server = http.createServer(app);
const twitterController = require('./api/controller/twitterController');
const wordsConfig = require('./config/words');
const bpiController  = require('./api/controller/bpiController')
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
log4js.configure('./config/log4js.json');

server.listen(port)
var logData=  function (err,data){
  if(err){
    console.error(err)
  }
  else{
    console.log(data);
  }
}
setInterval(function () {
for (i = 0; i < wordsConfig.currency.length; i++) {
    console.log(wordsConfig.currency[i]);
    twitterController.pullDataFromTwitter(wordsConfig.currency[i],logData);
  }
}, 60000);

setInterval(function () {
  bpiController.getCurrentBpi(logData);
  }, 60000);
  
console.log(" Server Started ");