import React from 'react';
import './StartView.css';
import Logo from '../../../../assets/images/logo.svg';
import Grid from '@material-ui/core/Grid';
import Views from '../../State/Views';


function StartView(props) {


  return (
    <div>
      <Grid container spacing={1}>
        <Grid className="logo-container" item xs={12}>
          <img style={{width: '80%'}} id="authentication-logo" alt="Logo" src={Logo}></img>
        </Grid>

        <Grid item xs={12}>
          <button onClick={() => props.setView(Views.Login)} className='login-button login-color'>Login</button>
        </Grid>

        <Grid item xs={12}>
          <button onClick={() => props.setView(Views.Guest)} className='login-button guest-color'>Play As Guest</button>
        </Grid>

        <Grid item xs={12}>
            <h6 className="register-text">Dont have an account? <span>
                    <button onClick={() => props.setView(Views.Register)} className="register-button">Register</button>
                </span>
            </h6>
        </Grid>

      </Grid>
    </div>
  );
}

export default StartView;