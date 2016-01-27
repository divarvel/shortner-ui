/**
 * @jsx React.DOM
 */
var React = require('react');
var LinkLine = require('./LinkLine.jsx');

var LinkTable = React.createClass({displayName: 'LinkTable',
  render: function() {
    var createLine = function(link) {
        return <LinkLine key={link.link_id} link={link} />;
    };

    return (
    <table>
        <thead>
            <tr>
                <td>Code</td>
                <td>Long URL</td>
                <td>Hits</td>
                <td>Action</td>
            </tr>
        </thead>
        <tfoot></tfoot>
        <tbody>{ (this.props.links || []).map(createLine) }</tbody>
    </table>);
  }
});

module.exports = LinkTable;
