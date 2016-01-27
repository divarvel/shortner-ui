var React = require('react');
var Bacon = require('baconjs');
var $ = require('jquery');

var LoginForm = require('./components/LoginForm.jsx');
var CreateForm = require('./components/CreateForm.jsx');
var LinkTable = require('./components/LinkTable.jsx');
var LinkLine = require('./components/LinkLine.jsx');



var displayedLinks = LoginForm.LoginFormBus.flatMap(function(creds) {
    console.log(creds);
    return Bacon.fromPromise(
        $.ajax({
            dataType: 'json',
            url: 'http://app.local/urls',
            username: creds.username,
            password: creds.password,
            xhrFields: {
                withCredentials: true
            }
        })
    );
}).toProperty(null);
var isConnected = displayedLinks.map(function(ls) { return ls !== null; });

isConnected.onValue(function(v) {
    if(v) {
        $("#login").hide();
        $("#edit").show();
    } else {
        $("#edit").hide();
        $("#login").show();
    }
});

var createNewLink = CreateForm.CreateFormBus.filter(isConnected);
var creations = createNewLink.flatMap(function(data) {
    console.log(data);
    if(data.code && data.long_url) {
        return Bacon.fromPromise(
            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: 'http://app.local/urls',
                data: {
                    code: data.code,
                    long_url: data.long_url
                },
                xhrFields: {
                    withCredentials: true
                }
            })
        );
    } else {
        return Bacon.once("error");
    }
});
creations.log();

React.renderComponent(
    LoginForm.LoginForm(null),
    document.querySelector(".login-form")
);

React.renderComponent(
    CreateForm.CreateForm(null),
    document.querySelector(".create-form")
);

displayedLinks.onValue(function(links) {
    React.renderComponent(
        LinkTable({ links: links }),
        document.querySelector(".links-table")
    );
});
