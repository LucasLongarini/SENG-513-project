import React, {useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Logo from '../../../../assets/images/logo.png';
import Grid from '@material-ui/core/Grid';
import Views from '../../State/Views';
import DisplayIconPicker from '../DisplayIconPicker/DisplayIconPicker';
import Emojis from '../../../../assets/images/DisplayEmojis/DisplayEmojis';


function RegisterView(props) {

    const [emojiIndex, setEmojiIndex] = useState(0);

    return (
        <div>
            <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
                <IconButton onClick={() => props.setView(Views.Start)}><ArrowBackIcon /></IconButton>
            </Grid>
            <Grid item xs={12}>
                <img className="authentication-logo" alt="Logo" src={Logo}></img>
            </Grid>

            <Grid item xs={6}>
                <DisplayIconPicker icons={Emojis} setIndex={setEmojiIndex} index={emojiIndex}/>
            </Grid>
            
            <Grid item xs={12}>
                <TextField id="display-name" label="Display Name" variant="outlined" fullWidth/>
            </Grid>

            { !props.isGuest &&
                <Grid item xs={12}>
                    <TextField id="email" label="Email" variant="outlined" fullWidth type="email"/>
                </Grid>
            }

            { !props.isGuest &&
                <Grid item xs={12}>
                    <TextField id="password" label="Password" variant="outlined" fullWidth type="password"/>
                </Grid>
            }  
            
            <Grid item xs={12}>
                <button className='login-button login-color'>{props.isGuest ? "Play" : "Register"}</button>
            </Grid>
            </Grid>
        </div>
    );
}

export default RegisterView;