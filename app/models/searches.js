'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Searches= new Schema({
	terms: {type: String, required: true, default: 1},
	time: {type: String, required: true, default: 1}
});

module.exports = mongoose.model('Searches', Searches);
