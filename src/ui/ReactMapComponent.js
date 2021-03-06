"use strict";

var React = require('react');
var invariant = require('react/lib/invariant');
var GoogleMapsAPI = require('../GoogleMapsAPI');
var MapOption = require('./MapOption');
var ReactMapComponentMixin = require('./ReactMapComponentMixin');

/**
 * React render implementation
 *
 * @returns {null}
 */
function nullRenderer() {
  return null;
}

/**
 * Create base constructor for google map class
 *
 * @param {string} constructorName
 * @returns {Function}
 */
function createGoogleMapClassConstructor(constructorName) {
  var Constructor = GoogleMapsAPI[constructorName];

  invariant(Constructor, 'Google Maps class of `%s` does not exist', constructorName);

  return function(props) {
    var options = MapOption.extractOptionsFromProps(props);

    return new Constructor(options);
  }
}


var ReactMapComponent = {

  /**
   * Create base map component of type
   *
   * @param {string} constructorName
   * @param {function?} constructorFn
   */
  create: function(constructorName, constructorFn) {
    return React.createClass({
      displayName: constructorName,

      mixins: [ReactMapComponentMixin],

      constructGoogleMapsClass: constructorFn || createGoogleMapClassConstructor(constructorName),

      render: nullRenderer
    });
  }
};

module.exports = ReactMapComponent;
