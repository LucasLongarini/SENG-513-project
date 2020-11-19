import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthenticationView from './Views/AuthenticationView/AuthenticationView';
import HomeView from './Views/HomeView/HomeView';
import axios from 'axios';
import packageJson from '../package.json';

axios.defaults.baseURL = packageJson.proxy;
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={AuthenticationView} />
        <PrivateRoute exact path="/" component={HomeView} />
      </Switch>
    </Router>
  );
}

export default App;
