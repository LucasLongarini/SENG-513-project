import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthenticationService from '../../services/AuthenticationService';

function PrivateRoute ({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={(props) => (
            //TODO have this token verified on the server
            localStorage.getItem('token') ? 
                <Component {...props} />
            : 
                <Redirect to={{pathname: "/login", state: { from: props.location}}} />
            )} 
        />
    );
}

export default PrivateRoute;