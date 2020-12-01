import React, { useState, useRef } from 'react';
import './CustomizeView.css';
import { Button, TextField, Switch, FormControlLabel, FormControl, Select, InputLabel, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import _ from "lodash";
import { useHistory } from 'react-router-dom';

// TODO handle user exit
function CustomizeView(props) {
  const router = useHistory();
  const [isPrivate, setIsPrivate] = useState(props.initialRoomSettings.isPrivate);
  const [password, setPassword] = useState(props.initialRoomSettings.password ? props.initialRoomSettings.password : "");
  const [rounds, setRounds] = useState(props.initialRoomSettings.rounds);
  const [timer, setTimer] = useState(props.initialRoomSettings.timer);
  const [isSpellcheck, setIsSpellcheck] = useState(props.initialRoomSettings.isSpellCheck);
  const delayPassword = useRef(_.debounce(value => updatePassword(value), 500), []).current;

  function onPasswordChanged(event) {
    setPassword(event.target.value);
    delayPassword(event.target.value);
  }

  function updateIsPrivate(event) {
    setIsPrivate(event.target.checked);
    props.updateRoom({ isPrivate: event.target.checked });
  }

  function updateRounds(event) {
    setRounds(event.target.value);
    props.updateRoom({rounds: event.target.value});
  }

  function updateTimer(event) {
    setTimer(event.target.value);
    props.updateRoom({timer: event.target.value});
  }

  function updateIsSpellCheck (event) {
    setIsSpellcheck(event.target.checked);
    props.updateRoom({ isSpellCheck: event.target.checked });
  }

  function updatePassword(value) {
    props.updateRoom({password: value});
  }

  return (
    <div className='CustomizeView-container'>
      <IconButton style={{
        maxWidth:"150px", 
        margin:"8px 0 0 0", 
        fontSize:"15px"}} 
        onClick={() => router.push('/')}><ArrowBackIcon />Back to Lobby</IconButton>
      <h2>{`Room: ${props.roomId}`}</h2>

      <div className='CustomizeView-form'>
        <FormControlLabel
            checked={isPrivate}
            label="Private"
            control={<Switch />}
            onChange={updateIsPrivate}
            className="CustomizeView-switch"
        />

        {isPrivate && <TextField label="Password" placeholder="Enter a room password" 
          variant="outlined" InputLabelProps={{shrink: true}} size='small'
          onChange={onPasswordChanged}
          value={password}
          style={{
            marginTop: "20px"
          }} />
        }

        <FormControl size='small' variant="outlined" style={{marginTop: "20px", maxWidth:'70px'}}>
          <InputLabel>Rounds</InputLabel>
          <Select
            native
            label="Rounds"
            value={rounds}
            onChange={updateRounds}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Select>
        </FormControl>

        <FormControl size='small' variant="outlined" style={{marginTop: "20px", maxWidth:'120px'}}>
          <InputLabel>Drawing Timer</InputLabel>
          <Select
            native
            value={timer}
            label="Drawing Timer"
            onChange={updateTimer}
          >
            <option value={30}>30s</option>
            <option value={45}>45s</option>
            <option value={60}>1m</option>
            <option value={90}>1m 30s</option>
            <option value={120}>2m</option>
            <option value={150}>2m 30s</option>
            <option value={180}>3m</option>
          </Select>
        </FormControl>

        <FormControlLabel
            style={{marginTop:"20px"}}
            checked={isSpellcheck}
            label="Allow Spellcheck"
            control={<Switch />}
            onChange={updateIsSpellCheck}
            className="CustomizeView-switch"
        />

      </div>
        
      <Button variant="contained" color="secondary" onClick={() => props.setIsGameStarted(true)}
        disableElevation style={{
          borderRadius: 0,
          color: "white"
        }}>    
        Start Game
      </Button>
    </div>
  );
}

export default CustomizeView;