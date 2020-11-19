import { React, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton, TextField, Grid } from '@material-ui/core';
import Logo from '../../../../assets/images/logo.png';
import Views from '../../State/Views';
import Axios from 'axios';

function LoginView(props) {

  const router = useHistory();
  const email = useRef();
  const password = useRef();
  
  async function handleKeyPressed(e) {
    if (e.key === 'Enter')
      await handleLogin();
  }

  async function handleLogin() {

    try {
      const response = await Axios.post('/user/login', { 
        email: email.current.value,
        password: password.current.value
      });
      
      // login success
      localStorage.setItem('token', response.data.token);
      router.push("/");
    }
    catch (error) {
      console.log(error);
    }
  }

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
          <TextField onKeyDown={handleKeyPressed} inputRef={email} label="Email" variant="outlined" fullWidth type="email"/>
        </Grid>

        <Grid item xs={12}>
          <TextField onKeyDown={handleKeyPressed} inputRef={password} label="Password" variant="outlined" fullWidth type="password"/>
        </Grid>
        
        <Grid item xs={12}>
          <button onClick={handleLogin} className='login-button login-color'>Login</button>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginView;