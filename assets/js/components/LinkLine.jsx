/**
 * @jsx React.DOM
 */
var React = require('react');

var LinkLine = React.createClass({displayName: 'LinkLine',
  render: function() {
    return (<tr>
        <td>{this.props.link.code}</td>
        <td>{this.props.link.long_url}</td>
        <td>{this.props.link.hits}</td>
    </tr>);
  }
});

module.exports = LinkLine;
