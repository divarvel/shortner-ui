import {Observable} from 'rx';
import {br, form, input, label, button} from '@cycle/dom';

const intent = (DOM) => {
  const validateEvent$ = DOM.select("#login-form")
          .events("submit")
          .do((evt) => {
            evt.preventDefault();
          })

  const credentials$ = validateEvent$
          .map((evt) => {
            return {
              login: evt.target["0"].value,
              password: evt.target["1"].value
            }
          });

  return credentials$;
}

const view = () => {
  return form({ id: "login-form", action: "#" }, [
      label("login"),
      input({ type: "text", name: "login", placeholder: "login" }),
      br(),
      label("password"),
      input({ type: "password", name: "password", placeholder: "password" }),
      br(),
      button({ type: "submit"}, "Login")
  ]);
}

const LoginForm = ({DOM}) => {
  const credentials$ = intent(DOM)

  return {
    DOM: Observable.just(view()),
    credentials$: credentials$
  };
}


export default LoginForm;
