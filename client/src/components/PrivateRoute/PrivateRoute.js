import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import authenticationService from '../../services/AuthenticationService';

function PrivateRoute ({ component: Component, ...rest }) {
    
    return (
        <Route {...rest} render={(props) => (
            authenticationService.isAuthenticated() ? 
                <Component {...props} />
            : 
                <Redirect to={{pathname: "/login", state: { from: props.location}}} />
            )} 
        />
    );
}

export default PrivateRoute;