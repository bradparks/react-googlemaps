/** @jsx React.DOM */
"use strict";

var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');
var keyMirror = require('react/lib/keyMirror');
var ReactMapComponents = require('../../ReactMapComponents');

var GoogleMapsMap = ReactMapComponents.Map;

// TODO: Remove the need for this, we shouldn't need to render 3 times to initialise
var MapLifeCycle = keyMirror({
  CREATING_HOLDER: null,
  CREATING_MAP: null
});

var ReactMap = React.createClass({
  propTypes: {
    width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
  },

  getInitialState: function() {
    return {
      mapLifeCycleState: MapLifeCycle.CREATING_HOLDER
    };
  },

  componentDidMount: function() {
    // Now we have the map created, we need to run the render
    // cycle again to pass down the `map` holder for the
    // components to render into.
    this.setState({mapLifeCycleState: MapLifeCycle.CREATING_MAP});
  },

  componentDidUpdate: function() {
    if (this.state.mapLifeCycleState === MapLifeCycle.CREATING_MAP) {
      this.setState({mapLifeCycleState: null});
    }
  },

  render: function() {
    var holderStyle = {
      width: this.props.width,
      height: this.props.height
    };

    var map;
    if (this.state.mapLifeCycleState !== MapLifeCycle.CREATING_HOLDER) {
      map = this.transferPropsTo(<GoogleMapsMap ref="map" mapDiv={this.refs.mapHolder.getDOMNode()} width={null} height={null} />);
    }

    // Check if there is an instance of a Google Map first
    // Loop through each child adding the `this.__node` object
    // to their props, this will allow the children to be injected
    // into this map instance.
    var children;
    if (!this.state.mapLifeCycleState) {
      var mapProps = {map: this.refs.map.__node};
      children = React.Children
        .map(this.props.children, function(child) {
          return React.isValidComponent(child) ? cloneWithProps(child, mapProps) : child;
        });
    }

    return (
      <div>
        <div
          ref="mapHolder"
          className={this.props.className}
          style={holderStyle} />

        {map}
        {children}
      </div>
      );
  }
});

module.exports = ReactMap;
