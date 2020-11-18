import React from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Logo from '../../../../assets/images/logo.png';
import Grid from '@material-ui/core/Grid';
import Views from '../../State/Views';



function LoginView(props) {

  const router = useHistory();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <IconButton onClick={() => props.setView(Views.Start)}><ArrowBackIcon /></IconButton>
        </Grid>
        <Grid item xs={12}>
          <img className="authentication-logo" alt="Logo" src={Logo}></img>
        </Grid>
        
        <Grid item xs={12}>
          <TextField id="email" label="Email" variant="outlined" fullWidth type="email"/>
        </Grid>

        <Grid item xs={12}>
          <TextField id="password" label="Password" variant="outlined" fullWidth type="password"/>
        </Grid>
        
        <Grid item xs={12}>
          <button onClick={() => router.push("/home")} className='login-button login-color'>Login</button>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginView;