/**
 * @jsx React.DOM
 */
var React = require('react');
var Bacon = require('baconjs');

var LoginFormBus = new Bacon.Bus();

var LoginForm = React.createClass({displayName: 'LoginForm',
      getInitialState: function() {
          return { username: null, password: null };
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
          LoginFormBus.push(this.state);
      },
      render: function() {
        var handleSubmit = function(e) {
            e.preventDefault();

        };
        return (
        <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.onChange('username')} value={this.state.username} /><br />
            <input type="password" onChange={this.onChange('password')} value={this.state.password} /><br />
            <input type="submit" />
        </form>);
      }
});

module.exports.LoginForm = LoginForm;
module.exports.LoginFormBus = LoginFormBus;
