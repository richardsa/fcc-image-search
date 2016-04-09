'use strict';

require('dotenv').load();
var path = process.cwd();
var request = require('request');
var response;
var flickrAPI = process.env.FLICKR_API;
var baseSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=10&format=json&nojsoncallback=1&api_key=" + flickrAPI + "&text=";


function SearchHandler() {
  var Searches = require('../models/searches.js');

  this.getHistory = function(req, res) {
    var clickProjection = {
      '_id': false
    };
    Searches.collection.find({
    
  }).toArray(function(err, docs) {
    if (err) throw err
    console.log(docs)
    res.send(docs);
  })
/*    var x = Searches.collection.find({
      terms: 1,
      time: 1,
      _id: 0
    }).sort({
      _id: -1
    }).limit(5)
    console.log(x);
    res.send("yeah bruh");*/
  };

  // function to retrieve json from flickr and return sanitized version for user
  this.getClean = function(req, res) {
    var d = new Date();
    var terms = req.params.searchTerm;
    var doc = {
      "term": terms,
      "when": d
    }
    Searches.collection.insert({
      "terms": terms,
      "time": d
    }, function(err) {
      if (err) {
        throw err;
      }
    });
    var offset = req.query.offset;
    if (offset) {
      offset = "&page=" + offset;
    } else {
      offset = "&page=1";
    }
    console.log(new Date());
    var searchTerm = req.params.searchTerm.split(' ').join('+');
    console.log(searchTerm);
    var url = baseSearchURL + searchTerm + offset;
    console.log(url);
    //  json: true
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // from within the callback, write data to response, essentially returning it.
        body = cleanJSON(body);
        res.send(body);
      }
    })
    console.log(offset);

  };





  function cleanJSON(dirtyJSON) {
    var dirty = JSON.parse(dirtyJSON)
    var clean = [];
    console.log(dirty);
    console.log("hey " + dirty.photos);
    for (var i = 0; i < dirty.photos.photo.length; i++) {
      var farmID = dirty.photos.photo[i].farm;
      var serverID = dirty.photos.photo[i].server;
      var photoID = dirty.photos.photo[i].id;
      var secret = dirty.photos.photo[i].secret;
      var originalURL = "https:\/\/farm" + farmID + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + ".jpg";
      var thumbNail = "https:\/\/farm" + farmID + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + "_t.jpg";
      var title = dirty.photos.photo[i].title;
      var obj = {
        "url": originalURL,
        "thumbnail": thumbNail,
        "title": title
      };
      clean.push(obj);
      //console.log(originalURL);
      //console.log(dirty.photos.photo[i].title);
      //var obj = data.messages[i];
    }
    // ...
    return clean;
  }

}

module.exports = SearchHandler;