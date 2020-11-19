import { React, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { TextField, Grid, IconButton } from '@material-ui/core';
import Logo from '../../../../assets/images/logo.png';
import Views from '../../State/Views';
import DisplayIconPicker from '../DisplayIconPicker/DisplayIconPicker';
import Emojis from '../../../../assets/images/DisplayEmojis/DisplayEmojis';
import Axios from 'axios';


function RegisterView(props) {

    const [emojiIndex, setEmojiIndex] = useState(0);
    const router = useHistory();
    const email = useRef();
    const password = useRef();
    const name = useRef();

    async function handleKeyPressed(e) {
        if (e.key === 'Enter')
          await handleRegister();
    }
    
    async function handleRegister() {

        try {
            const response = await Axios.post('/user/register', { 
                email: email.current ? email.current.value : undefined,
                password: password.current ? password.current.value : undefined,
                name: name.current ? name.current.value : "",
                emojiId: emojiIndex,
                isGuest: props.isGuest
            });
            
            // register success
            localStorage.setItem('token', response.data.token);
            router.push("/");
        }
        catch (error) {
            console.log(error);
        }
    }

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
                <TextField onKeyDown={handleKeyPressed} inputRef={name} label="Display Name" variant="outlined" fullWidth/>
            </Grid>

            { !props.isGuest &&
                <Grid item xs={12}>
                    <TextField onKeyDown={handleKeyPressed} inputRef={email} label="Email" variant="outlined" fullWidth type="email"/>
                </Grid>
            }

            { !props.isGuest &&
                <Grid item xs={12}>
                    <TextField onKeyDown={handleKeyPressed} inputRef={password} label="Password" variant="outlined" fullWidth type="password"/>
                </Grid>
            }  
            
            <Grid item xs={12}>
                <button onClick={handleRegister} className='login-button login-color'>{props.isGuest ? "Play" : "Register"}</button>
            </Grid>
            </Grid>
        </div>
    );
}

export default RegisterView;