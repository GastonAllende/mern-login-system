import React from 'react';
import Home from './components/home';
import Dashboard from "./components/dashboard";
import Register from './components/register';
import Login from './components/login';

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
        <SecuredRoute path="/dashboard" component={Dashboard} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>

  );
}

export default App;
