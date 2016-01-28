require('file?name=dist/[name].[ext]!./index.html')

import Cycle from '@cycle/core';
import {form, div, label, input, h1, ul, li, p, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {Observable} from 'rx';

import LoginForm from './components/LoginForm.js';
import UrlList from './components/UrlList.js';
import UrlForm from './components/UrlForm.js';

function isUrlsList(request) {
  return request.req.url === "/api/urls" &&
         request.req.method === "GET";
}

function isUrlsModification(request) {
  const isModification = 
    request.req.method === "POST" ||
    request.req.method === "PUT" ||
    request.req.method === "DELETE";

  return request.req.url.indexOf("/api/urls") === 0 &&
         isModification;
}

function withAuth(request$, credentials$) {
  return request$.withLatestFrom(credentials$, (req, creds) => {
    req.user = creds.login;
    req.password = creds.password;

    return req;
  });
}


function main(sources) {
  const httpContents$ = sources.HTTP.mergeAll()

  const isConnected$ = httpContents$.map(x => x.statusCode < 400)
    .startWith(false);

  const urls$ = httpContents$
    .filter(isUrlsList)
    .filter(x => x.statusCode < 400)
    .map(x => JSON.parse(x.text))
    .startWith([]);

  const loginForm = LoginForm(sources);
  const urlForm = UrlForm(sources);
  const urlList = UrlList({ DOM: sources.DOM, urls$: urls$ });

  const newUrlQuery$ =
    urlForm.newUrl$.map((newUrl) => {
    return {
      eager: true,
      url: "/api/urls",
      method: "POST",
      send: {code: newUrl.code, long_url: newUrl.long_url}
    };
  });

  const refreshOnLogin$ = loginForm.credentials$.map(() => null)
  const refreshOnChanges$  =
    httpContents$
      .filter(isUrlsModification)
      .map(() => null)

  const refreshQuery$ =
    refreshOnLogin$.merge(refreshOnChanges$).map(() => {
    return {
      eager: true,
      url: "/api/urls"
    };
  });

  const deleteQuery$ =
    urlList.itemAction$.map((action) => {
      return {
        eager: true,
        url: "/api/urls/" + action.url_id,
        method: "DELETE"
      }
    })

  const queries$ = Observable.merge(refreshQuery$, newUrlQuery$, deleteQuery$);
  const authenticatedQueries$ = withAuth(queries$, loginForm.credentials$);

  const vtree$ = isConnected$.flatMap(isConnected => {
    if(!isConnected) {
      return loginForm.DOM;
    } else {
      return Observable.combineLatest(urlList.DOM, urlForm.DOM, (list,form) => {
        return div([
            form,
            list
        ]);
      })
    }
  });


  const sinks = {
    DOM: vtree$,
    HTTP: authenticatedQueries$
  };

  return sinks;
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app-container'),
  HTTP: makeHTTPDriver()
});
