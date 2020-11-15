import React from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import './LoginView.css';

function LoginView() {
  return (
    <div className='login-view'>
        <Container className='login-container' maxWidth='sm'>
          <TextField id="standard-basic" label="Standard" fullWidth/>
        </Container>
    </div>
  );
}

export default LoginView;