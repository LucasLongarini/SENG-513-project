import { React, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Background from '../../../assets/images/Authpage_background.jpg';
import DoodleHeader from '../../../components/DoodlerHeader.js'
import GameBoard from './GameBoard.js'
import {
    Paper,
    Grid,
    Typography,
} from '@material-ui/core';
import Axios from 'axios';
// import authenticationService from '../../../../services/AuthenticationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        widht: '100vw',
    },
    game: {
        backgroundColor: '#ffeaea',
        backgroundImage: 'url(https://maps.gstatic.com/mapfiles/santatracker/v201912242254/scenes/speedsketch/img/speedsketch-background.svg)',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        height: '100%',
        position: 'relative',
    },
}));

const Game = (props) => {
    const classes = useStyles();
    const router = useHistory();

    return (
        <div className={classes.root}>
            <div className={classes.game}>
                <GameBoard/>
            </div>
        </div>
    );
}

export default Game;