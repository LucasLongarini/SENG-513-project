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
        // height: '100vh',
        // width: '100vw',
        // backgroundImage: `url(${Background})`,
        // backgroundPosition: 'center center',
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        // flexGrow: 1,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${Background})`,
        flexGrow: 1,
    },
    game: {
        // backgroundColor: '#ffeaea',
        // backgroundImage: 'url(https://maps.gstatic.com/mapfiles/santatracker/v201912242254/scenes/speedsketch/img/speedsketch-background.svg)',
        // backgroundImage: `url(${Background})`,
        // backgroundPosition: 'center center',
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
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
        zIndex:99999,
        // display: 'none',
    },
    gridContainer: {
        width: '100%',
        height: '100%',
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
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
        <div className={classes.root} >
            <div ref={gameBoardPenRef} className={classes.gameBoardPen}></div>
            <Grid className={classes.gridContainer} container spacing={3} onMouseMove={(e) => onPenMove(e)}>
                <DoodleHeader />
                <Grid item xs={12} sm={1}>
                     <Paper className={classes.paper}>
                         Yo
                     </Paper>
                </Grid>
                <Grid item xs={12} sm={10}>
                    <div className={classes.game} >
                        <GameBoard/>
                    </div>
                </Grid>
                 <Grid item xs={12} sm={1}>
                     <Paper className={classes.paper}>
                         Momma
                     </Paper>
                </Grid>
            </Grid>
{ false &&            <div className={classes.game} onMouseMove={(e) => onPenMove(e)}>
                <GameBoard/>
                <div ref={gameBoardPenRef} className={classes.gameBoardPen}></div>
            </div>}
        </div>
    );
}

export default Game;