import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthenticationService from '../../services/AuthenticationService';

function PrivateRoute ({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={(props) => (
            AuthenticationService.isAuthenticated ? 
                <Component {...props} />
            : 
                <Redirect to={{pathname: "/", state: { from: props.location}}} />
            )} 
        />
    );
}

export default PrivateRoute;