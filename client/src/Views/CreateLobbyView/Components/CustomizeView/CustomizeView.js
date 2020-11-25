import React, {useState} from 'react';
import './CustomizeView.css';
import { Button, TextField, Switch, FormControlLabel, FormControl, Select, InputLabel, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function CustomizeView(props) {

  const [isPrivate, setIsPrivate] = useState(false);
  const [isSpellcheck, setIsSpellcheck] = useState(false);

  return (
    <div className='CustomizeView-container'>
      <IconButton style={{
        maxWidth:"150px", 
        margin:"8px 0 0 0", 
        fontSize:"15px"}} 
        onClick={() => null}><ArrowBackIcon />Back to Lobby</IconButton>
      <h2>Room: 12345</h2>

      <div className='CustomizeView-form'>
        <FormControlLabel
            checked={isPrivate}
            label="Private"
            control={<Switch />}
            onChange={(event) => setIsPrivate(event.target.checked)}
            className="CustomizeView-switch"
        />

        {isPrivate && <TextField label="Password" placeholder="Enter a room password" 
        variant="outlined" InputLabelProps={{shrink: true}} size='small'
        style={{
          marginTop: "20px"
        }} />}

        <FormControl size='small' variant="outlined" style={{marginTop: "20px", maxWidth:'70px'}}>
          <InputLabel>Rounds</InputLabel>
          <Select
            native
            label="Rounds"
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
            label="Drawing Timer"
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
            onChange={(event) => setIsSpellcheck(event.target.checked)}
            className="CustomizeView-switch"
        />

      </div>
        
      <Button variant="contained" disableElevation style={{
        backgroundColor: "#D6504F",
        borderRadius: 0,
        color: "white"
      }}>    
        Start Game
      </Button>
    </div>
  );
}

export default CustomizeView;