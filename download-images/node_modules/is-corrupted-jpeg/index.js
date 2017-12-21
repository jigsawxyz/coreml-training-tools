'use strict';

var imageSize = require('image-size');
var path = require('path');

module.exports = function isCorruptedJpeg(filepath) {
  if (!/^\.?jpe?g$/i.test(path.extname(filepath))) {
    return false;
  }

  try {
    // if no error is thrown, it's not corrupted
    imageSize(filepath);
    return false;
  } catch (err) {}

  return true;
};
