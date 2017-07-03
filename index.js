/* jshint esversion: 6 */
const request = require('unirest');
const restify = require('restify');
const compression = require('compression');


var server = restify.createServer({
  name: 'Daily Petrol Prices in India',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS({
  origins: ['*'],
  credentials: true,
  headers: ['x-foo']
}));
server.use(compression());

server.get('/petrol-price/:state/:city', function(req, res, next) {
  let city = req.params.city.toLowerCase();

  request.post("https://fuelprice.p.mashape.com/")
    .header("X-Mashape-Key", process.env.mashapeKey)
    .header("Content-Type", "application/json")
    .header("Accept", "application/json")
    .send({
      "fuel": "p",
      "state": req.params.state.toLowerCase()
    })
    .end(function(result) {
      res.send(result.body.prices.hp.find(o => o.city.toLowerCase() === city));
    });
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
