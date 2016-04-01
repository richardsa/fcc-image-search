'use strict';

var path = process.cwd();
var request = require('request');
//var UrlHandler = require(path + '/app/controllers/urlHandler.js');
var response;

module.exports = function(app, passport) {
  app.route('/')
    .get(function(req, res) {
      res.sendFile(path + '/public/index.html');
    });
  app.route('/search')
    .get(function(req, res) {
      request({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ecba3714cd37e87eb8c67afd54700379&tags=image&per_page=10&page=2&format=json&nojsoncallback=1&api_sig=0bafb8ddfe02f0c9be22b0b7f255cfc0',
        json: true
      }, function(err, res, json) {
        if (err) {
          throw err;
        }
        response = json;
        //res.json(json);
      });
      res.send(response);
    });

  /*  app.route('/:id')
    	.get(urlHandler.getFull)

    app.route('/new/:url(*)') // allow forward slashes in route: http://stackoverflow.com/a/24366031
    	.get(urlHandler.getShortened)
    	
    	app.route('/test/test')
    	.get(urlHandler.getDrop)*/

};