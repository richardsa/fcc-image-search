'use strict';
//load to access flickr_api variable
require('dotenv').load();
var path = process.cwd();
var request = require('request');
//var UrlHandler = require(path + '/app/controllers/urlHandler.js');
var response;
var flickrAPI = process.env.FLICKR_API;

var baseSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=10&format=json&nojsoncallback=1&api_key=" + flickrAPI + "&text=";

module.exports = function(app, passport) {
  app.route('/')
    .get(function(req, res) {
      res.sendFile(path + '/public/index.html');
    });


  // used this solution for routing guidance
  app.get('/search/:searchTerm', function(req, res) {
    var offset = req.query.offset;
    if (offset) {
      offset = "&page=" + offset;
    } else {
      offset = "&page=1";
    }
    var searchTerm = req.params.searchTerm.split(' ').join('+');
    console.log(searchTerm);
    var url = baseSearchURL + searchTerm + offset;
    console.log(url);
    //  json: true
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // from within the callback, write data to response, essentially returning it.
        cleanJSON(body);
        res.send(body);
      }
    })
    console.log(offset);
    //  console.log(baseSearchURL + req.params.searchTerm + offset);
  });
  /*request({
        url: baseSearchURL + req.params.searchTerm + offset,
        json: true
      }, function(err, res, json) {
        if (err) {
          throw err;
        }
        console.log("json " + json);
        response = json;
        //res.send(response);
        //res.send(response);

      });
    console.log("response " + response)
      
      res.send(response);*/


  /*  app.route('/:id')
    	.get(urlHandler.getFull)

    app.route('/new/:url(*)') // allow forward slashes in route: http://stackoverflow.com/a/24366031
    	.get(urlHandler.getShortened)
    	
    	app.route('/test/test')
    	.get(urlHandler.getDrop)*/
  //function to clean up json input before outputting to user
  function cleanJSON(dirtyJSON) {
    var dirty = JSON.parse(dirtyJSON)
    console.log(dirty);
    console.log("hey " + dirty.photos);
    for (var i = 0; i < dirty.photos.photo.length; i++) {
      console.log(dirty.photos.photo[i].title);
      //var obj = data.messages[i];
    }
    // ...
  }
  //console.log(dirty);


};