import { React, useRef } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton, TextField, Grid } from '@material-ui/core';
import Logo from '../../../../assets/images/logo.svg';
import Views from '../../State/Views';
import Axios from 'axios';
import authenticationService from '../../../../services/AuthenticationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function LoginView(props) {

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
      authenticationService.saveToken(response.data.token);
      authenticationService.saveDisplayName(response.data.user.name);
      authenticationService.saveEmojiId(response.data.user.emojiId);
      authenticationService.saveIsGuest(response.data.user.isGuest);
      authenticationService.saveId(response.data.user.id);

      await authenticationService.verifyToken();
      props.handleRedirect();     
    }
    catch (error) {
      console.log(error);
      toast.error("Authentication error");
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