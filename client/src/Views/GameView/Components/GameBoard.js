import { React, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Background from '../../../assets/images/Authpage_background.jpg';
import DoodleHeader from '../../../components/DoodlerHeader.js'
import CanvasDraw from "react-canvas-draw";
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
    gameBoard: {
        // height: '0',
        left: '15%',
        paddingBottom: '35.112%',
        position: 'relative',
        top: '5.3%',
        width: '60%',
    },
    gameBoardCanvas: {
        borderRadius: '5px 5px 0 0',
        boxShadow: '15px 15px 0 0 rgba(0,0,0,.2)',
        cursor: 'none',
        position: 'relative',
        width:' 100% !important',
        '-webkitUserDrag': 'none',
        userSelect: 'none',
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
    },
    gameBoardPen: {
        backgroundImage: 'url(https://maps.gstatic.com/mapfiles/santatracker/v201912242254/scenes/speedsketch/img/pen.svg);',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        bottom: '0',
        height: '25.5%',
        left: '0',
        position: 'absolute',
        width: 50,
        height: 50,

    }
}));

const GameBoard = (props) => {
    const classes = useStyles();
    const router = useHistory();

    return (
        <div className={classes.gameBoard}>
            <CanvasDraw className={classes.gameBoardCanvas} hideInterface hideGrid canvasHeight="70vh"/>
            <div className={classes.gameBoardPen}></div>
        </div>
    );
}

export default GameBoard;