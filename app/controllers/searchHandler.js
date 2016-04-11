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
    // sort from http://stackoverflow.com/a/20595736
  }, clickProjection).sort({'time': -1}).limit(5).toArray(function(err, docs) {
    if (err) throw err
    res.send(docs);
  })


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
    var searchTerm = req.params.searchTerm.split(' ').join('+');
    var url = baseSearchURL + searchTerm + offset;
    // solution from http://stackoverflow.com/a/16866525
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        body = cleanJSON(body);
        res.send(body);
      }
    })
    

  };





  function cleanJSON(dirtyJSON) {
    var dirty = JSON.parse(dirtyJSON)
    var clean = [];
  
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
    }
  
    return clean;
  }

}

module.exports = SearchHandler;