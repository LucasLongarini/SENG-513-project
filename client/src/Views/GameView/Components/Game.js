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
        // backgroundImage: 'url(https://maps.gstatic.com/mapfiles/santatracker/v201912242254/scenes/speedsketch/img/speedsketch-background.svg)',
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        height: '100%',
        position: 'relative',
    },
    gameBoardPen: {
        backgroundImage: 'url(https://maps.gstatic.com/mapfiles/santatracker/v201912242254/scenes/speedsketch/img/pen.svg);',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        top: '0',
        height: '25.5%',
        left: '0',
        position: 'absolute',
        width: 50,
        height: 50,
        cursor: 'none',
        pointerEvents: 'none',
    }
}));

const Game = (props) => {
    const gameBoardPenRef = useRef(null);

    const classes = useStyles();
    const router = useHistory();

    const onPenMove = (e) => {
        gameBoardPenRef.current.style.left = `${e.pageX}px`;
        gameBoardPenRef.current.style.top = `${e.pageY-50}px`;
    }

    return (
        <div className={classes.root}>
            <div className={classes.game} onMouseMove={(e) => onPenMove(e)}>
                <GameBoard/>
                <div ref={gameBoardPenRef} className={classes.gameBoardPen}></div>
            </div>
        </div>
    );
}

export default Game;