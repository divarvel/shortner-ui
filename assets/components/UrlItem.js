import {span, li, p, button} from '@cycle/dom';
import {Observable} from 'rx';

const intent = (DOM) => {
  const actions$ = Observable.merge(
    DOM.select(".edit").events("click").map(() => { return { type: "edit" } }),
    DOM.select(".delete").events("click").map(() => { return { type: "delete" } })
  );

  return actions$;
}

const model = (props$, action$) => {
  const sanitizedProps$ = props$.startWith({ code: "", long_url: "" });

  return sanitizedProps$;
}

const view = (state$) => {
  return state$.map(props => {
    return li([
        span(props.code + ": " + props.long_url),
        button(".edit", "/"),
        button(".delete", "X")
    ]);
  });
}


const UrlItem = ({ DOM, props$ }) => {
  const action$ = intent(DOM);
  const state$ = model(props$, action$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$
  };
}

export default UrlItem;
