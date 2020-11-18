import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthenticationView from './Views/AuthenticationView/AuthenticationView';
import HomeView from './Views/HomeView/HomeView';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AuthenticationView} />
        <PrivateRoute exact path="/home" component={HomeView} />
      </Switch>
    </Router>
  );
}

export default App;
