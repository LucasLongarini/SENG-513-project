import { React, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GameBoard from './GameBoard.js'
import Chat from '../Components/ChatView/ChatContainer';
import {
    Paper,
    Grid,
    Typography,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
    },
    game: {
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
        left: '0',
        position: 'absolute',
        width: 50,
        height: 50,
        cursor: 'none',
        pointerEvents: 'none',
        zIndex:99999,
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
    gameHeader: {
        width: '100%',
        height: '5vh',
        textAlign: 'center',
        verticalAlign: 'center',
    },
    gameHeaderPaper: {
        width: '100%',
        margin: 'auto'
    }
}));

const Game = (props) => {
    const {
        initialRoomSettings,
        roomId,
        socketRef,
    } = props;
    const gameBoardPenRef = useRef(null);
    const classes = useStyles();
    const router = useHistory();

    const onPenMove = (e) => {
        gameBoardPenRef.current.style.left = `${e.pageX}px`;
        gameBoardPenRef.current.style.top = `${e.pageY-50}px`;
    }

    const renderGameHeaderContent = () => {
        return (
          <div >
            <Paper className={classes.gameHeaderPaper}>
              <Grid container className={classes.gameHeader}>
                  <Grid item xs={1} sm={3}>Time</Grid>
                  <Grid item xs={1} sm={3}>Round</Grid>
                  <Grid item xs={1} sm={6}>{`S _ _ E _   M _ N`}</Grid>
              </Grid>
            </Paper>
          </div>
        )
    }

    return (
        <div className={classes.root} >
            <div ref={gameBoardPenRef} className={classes.gameBoardPen}></div>
            <Grid className={classes.gridContainer} container spacing={3} onMouseMove={(e) => onPenMove(e)}>
                <Grid item spacing={3} xs={10}>
                    {renderGameHeaderContent()}
                    <div className={classes.game} >
                        <GameBoard socketRef={socketRef} />
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <Chat/>
                </Grid>
            </Grid>
        </div>
    );
    
}

export default Game;