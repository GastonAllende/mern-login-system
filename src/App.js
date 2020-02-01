import React from 'react';
import Home from './components/home';
import Dashboard from "./components/dashboard";
import Register from './components/auth/register';
import Login from './components/auth/login';
import Passwordforgot from './components/auth/passwordforgot';
import Passwordreset from './components/auth/passwordreset';


import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import './App.css';


const isLoggedIn = () => {
  return localStorage.getItem('TOKEN_KEY') != null;
};

// Protected Route
const SecuredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      // ternary condition
      isLoggedIn() === true ? (
        <Component {...props} />
      ) : (
          <Redirect to="/login" />
        )
    }
  />
);

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login/:notify?" component={Login} />
        <SecuredRoute path="/dashboard" component={Dashboard} />
        <Route path="/password-reset/:token" component={Passwordreset} />
        <Route path="/password-forgot" component={Passwordforgot} />
      </Switch>
    </Router>
  );
}

export default App;
