'use strict';

var languages = require('languages-list');
var pickItem  = require('pick-item');

module.exports = function () {
  return pickItem(languages);
};
