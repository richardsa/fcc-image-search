'use strict';

var path = process.cwd();
var SearchHandler = require(path + '/app/controllers/searchHandler.js');


module.exports = function(app, passport) {
  var searchHandler = new SearchHandler();

  app.route('/')
    .get(function(req, res) {
      res.sendFile(path + '/public/index.html');
    });

  app.route('/api/latest/imagesearch/')
    .get(searchHandler.getHistory);


  app.route('/api/search/:searchTerm')
    .get(searchHandler.getClean);

};