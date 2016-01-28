import {Observable} from 'rx';
import {form, label, input, br, button} from '@cycle/dom';

const view = () => {
  return form({ id: "url-form", action: "#" }, [
      label("code"),
      input({ type: "text", name: "code", placeholder: "code" }),
      br(),
      label("long_url"),
      input({ type: "url", name: "long_url", placeholder: "long url" }),
      br(),
      button({ type: "submit"}, "Send")
  ]);
}


const UrlForm = ({ DOM, urls$ }) => {
  const validateEvent$ = DOM.select("#url-form")
          .events("submit")
          .do((evt) => {
            evt.preventDefault();
          })

  const newUrl$ = validateEvent$
          .map((evt) => {
            return {
              code: evt.target["0"].value,
              long_url: evt.target["1"].value
            }
          });

  return {
    DOM: Observable.just(view()),
    newUrl$: newUrl$
  };
}

export default UrlForm;
