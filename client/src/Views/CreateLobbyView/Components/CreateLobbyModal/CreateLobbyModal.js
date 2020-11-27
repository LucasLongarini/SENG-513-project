import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton, TextField, Button, Grid } from '@material-ui/core';
import './CreateLobbyModal.css';

Modal.setAppElement('#root');

function CreateLobbyModal({isValidRoom, isPrivateRoom, isHost, validatePassword}) {

  let showModal = !isValidRoom || (isPrivateRoom && !isHost);
  const router = useHistory();
  let password = useRef();

  return (
    <Modal overlayClassName='CreateLobbyModal-overlay' className='CreateLobbyModal-content' isOpen={showModal}>
      <IconButton style={{
        maxWidth:"150px",
        padding: "12px 0", 
        fontSize:"15px"}} 
        onClick={() => router.push('/')}><ArrowBackIcon />Back to Lobby
      </IconButton>

      { isValidRoom ?
        // if valid room, render password if needed
        <div>
          <h3>Enter the room password</h3>
          <TextField label="Enter password" placeholder="" fullWidth={true} 
            variant="outlined" InputLabelProps={{shrink: true}} size='small'
            inputRef={password}            
            style={{
              marginTop: "20px"
            }} 
          />
          <Grid container justify="flex-end">
            <Button variant="contained" color="secondary" style={{
                borderRadius: 0,
                color: "white",
                marginTop: "20px"
              }}
              onClick={() => validatePassword(password.current.value)}
              >    
                Join Game
            </Button>
          </Grid>
        </div> :

        // if not, room doesn't exist
        <div className='CreateLobbyModal-error'>
          <h1>This room does not exist</h1>
        </div>
      }

    </Modal>
  );
}

export default CreateLobbyModal;