import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthenticationService from '../../services/AuthenticationService';

function PrivateRoute ({ component: Component, ...rest }) {

    const [authentication, setAuthentication] = useState(false);

    useEffect(() => {
        AuthenticationService.verifyToken()
            .then(() => {
                console.log('token is valid')
                setAuthentication(true)
            })
            .catch(() => {
                console.log('token is NOT valid')
                setAuthentication(false)
            })
    });

    console.log(authentication);
    return (
        <Route {...rest} render={(props) => (
            authentication ? 
                <Component {...props} />
            : 
                <Redirect to={{pathname: "/login", state: { from: props.location}}} />
            )} 
        />
    );
}

export default PrivateRoute;