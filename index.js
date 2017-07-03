/* jshint esversion: 6 */
const request = require('unirest');
const restify = require('restify');
const compression = require('compression');
const states = require('./states').states;

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
  let state = req.params.state.toLowerCase();
  state = (state.length !== 2 ? states[state] : state) || 'mh';
  let city = req.params.city.toLowerCase();

  request.post("https://fuelprice.p.mashape.com/")
    .header("X-Mashape-Key", process.env.mashapeKey)
    .header("Content-Type", "application/json")
    .header("Accept", "application/json")
    .send({
      "fuel": "p",
      "state": state
    })
    .end(function(result) {
      res.send(result.body.prices.hp.find(o => o.city.toLowerCase() === city));
    });
});

server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
