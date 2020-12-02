import { React, useState, useRef } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { TextField, Grid, IconButton } from '@material-ui/core';
import Logo from '../../../../assets/images/logo.png';
import Views from '../../State/Views';
import DisplayIconPicker from '../DisplayIconPicker/DisplayIconPicker';
import Emojis from '../../../../assets/images/DisplayEmojis/DisplayEmojis';
import Axios from 'axios';
import authenticationService from '../../../../services/AuthenticationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function RegisterView(props) {

    const [emojiIndex, setEmojiIndex] = useState(0);
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
            authenticationService.saveToken(response.data.token);
            authenticationService.saveDisplayName(response.data.user.name);
            authenticationService.saveEmojiId(response.data.user.emojiId);
            authenticationService.saveIsGuest(response.data.user.isGuest);
            authenticationService.saveId(response.data.user.id);

            await authenticationService.verifyToken();
            props.handleRedirect();     
        }
        catch (error) {
            toast.error("Authentication error");
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