import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.js';
import AuthenticationView from './Views/AuthenticationView/AuthenticationView';
import HomeView from './Views/HomeView/HomeView';
import axios from 'axios';
import packageJson from '../package.json';

axios.defaults.baseURL = packageJson.proxy;
function App() {
  const isDev = true; // remove for production
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={AuthenticationView} />
        {isDev ? <Route exact path="/" component={HomeView} /> : <PrivateRoute exact path="/" component={HomeView} />}
      </Switch>
    </Router>
  );
}

export default App;
