import {ul, li, p, button} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {Observable} from 'rx';

import UrlItem from './UrlItem.js';

const view = (state$) => {
  return state$.map(urls => {
    return ul(urls.map(url => {
      return url.item.DOM
    }));
  });
}



const UrlList = ({ DOM, urls$ }) => {
  const state$ = urls$.map(urls => {
    return urls.map(url => {
      const item = isolate(UrlItem)({ DOM, props$: Observable.just(url) });
      return {
        data: url,
        item: {
          DOM: item.DOM,
          action$: item.action$.map((ev) => { return {type: ev.type, url_id: url.url_id} })
        }
      };
    });
  }).shareReplay(1);

  const itemAction$ = state$.flatMapLatest((list) => {
    return Observable.merge(list.map((i) => {
      return i.item.action$;
    }))
  });

  return {
    DOM: view(state$),
    itemAction$
  };
}

export default UrlList;
