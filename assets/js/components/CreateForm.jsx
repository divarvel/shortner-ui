/**
 * @jsx React.DOM
 */
var React = require('react');
var Bacon = require('baconjs');

var CreateFormBus = new Bacon.Bus();

var CreateForm = React.createClass({displayName: 'CreateForm',
      getInitialState: function() {
          return { long_url: null, code: null };
      },
      onChange: function(field) {
          var self = this;
          return function(e) {
              var st = self.state;
              st[field] = e.target.value;
              self.setState(st);
          };
      },
      handleSubmit: function(e) {
          e.preventDefault();
          CreateFormBus.push(this.state);
      },
      render: function() {
        var handleSubmit = function(e) {
            e.preventDefault();

        };
        return (
        <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.onChange('long_url')} value={this.state.long_url} /><br />
            <input type="text" onChange={this.onChange('code')} value={this.state.code} /><br />
            <input type="submit" />
        </form>);
      }
});

module.exports.CreateForm = CreateForm;
module.exports.CreateFormBus = CreateFormBus;
