import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthenticationView from './Views/AuthenticationView/AuthenticationView';
import HomeView from './Views/HomeView/HomeView';
import CreateLobbyView from './Views/CreateLobbyView/CreateLobbyView';
import axios from 'axios';
import packageJson from '../package.json';

axios.defaults.baseURL = packageJson.proxy;
function App() {
  return (
    <Router>
      <Switch>
        {/* TODO remove */}
        {/* <Route exact path="/login" component={AuthenticationView} />
        <PrivateRoute exact path="/" component={HomeView} /> */}
        <Route exact path="/create" component={CreateLobbyView} />
      </Switch>
    </Router>
  );
}

export default App;
