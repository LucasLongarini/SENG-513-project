import { React, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GameBoard from './GameBoard.js'
import Chat from '../Components/ChatView/ChatContainer';
import {
    Paper,
    Grid,
    Button,
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
    gridItem: {
        height: '100%',
    },
    gridItemGame: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    gameHeader: {
        width: '100%',
        textAlign: 'center',
        verticalAlign: 'center',
    },
    gameHeaderPaper: {
        width: 'auto',
        margin: 'auto',
        padding: '20px',
    },
    wordPicker: {
        position: 'absolute',
        top: '20px',
        left: '0',
        bottom: '40px',
        width: '100%',
        borderRadius: '5px',
        background: ' rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
    },
    wordGrid: {
        marginTop: '10px',
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: '1fr 1fr 1fr'
    }
}));

const Game = (props) => {
    const {
        socket,
    } = props;
    const gameBoardPenRef = useRef(null);
    const classes = useStyles();
    const router = useHistory();
    const [words, setWords] = useState([]);

    useEffect(() => {
        if (socket !== undefined) {
            socket.on('new word', handleNewWord);
        }
    }, []);

    function handleNewWord(data) {
        let newWord = {name: data.name, word: data.word};
        setWords(oldWords => [...oldWords, newWord]);
    }

    const onPenMove = (e) => {
        gameBoardPenRef.current.style.left = `${e.pageX}px`;
        gameBoardPenRef.current.style.top = `${e.pageY-50}px`;
    }

    function handleSendWord(word) {
        if (word !== undefined && word.length > 0)
            socket.emit('send word', word);
    }

    return (
        <div className={classes.root} >
            <div ref={gameBoardPenRef} className={classes.gameBoardPen}></div>
            <Grid className={classes.gridContainer} container spacing={3} onMouseMove={(e) => onPenMove(e)}>
                <Grid className={classes.gridItemGame} item spacing={3} xs={10}>
                    <div >
                        <Paper className={classes.gameHeaderPaper}>
                            <Grid container className={classes.gameHeader}>
                                <Grid item xs={1} sm={3}>Round</Grid>
                                <Grid item xs={1} sm={6}>{`S _ _ E _   M _ N`}</Grid>
                                <Grid item xs={1} sm={3}>Time</Grid>
                            </Grid>
                        </Paper>
                    </div>
                    <div className={classes.game} >
                        <GameBoard socketRef={socket} />
                        <div className={classes.wordPicker}>
                            <h1>Choose a word:</h1>
                            <div className={classes.wordGrid}>
                                <Button variant="contained">Word 1</Button>
                                <Button variant="contained">Word 2</Button>
                                <Button variant="contained">Word 3</Button>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid className={classes.gridItem} item xs={2}>
                    <Chat words={words} onNewWord={handleSendWord}/>
                </Grid>
            </Grid>
        </div>
    );
    
}

export default Game;