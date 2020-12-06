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
import authenticationService from '../../../services/AuthenticationService';

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
    },
    wordHint: {
        whiteSpace: 'break-spaces'
    },
    headerItems: {
        margin: 'auto',
    },
}));

const Game = (props) => {
    const {
        socket,
    } = props;
    const gameBoardPenRef = useRef(null);
    const classes = useStyles();
    const router = useHistory();
    const [words, setWords] = useState([]);
    const [chooseWords, setChooseWords] = useState([]);
    const [turnStarted, setTurnStarted] = useState(false);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const [turnEnded, setTurnEnded] = useState(false);
    const [correctWord, setCorrectWord] = useState("");
    const [timer, setTimer] = useState(0);
    const [round, setRound] = useState(1);
    const [wordHint, setWordHint] = useState("");

    useEffect(() => {
        if (socket !== undefined) {
            socket.on('new guess', handleNewGuess);

            // your turn has started
            socket.on('start your turn', words => {
                setIsYourTurn(true);
                setTurnEnded(false);
                setTurnStarted(false);
                setChooseWords(words);
            });

            // it is the userId's turn
            socket.on('switch turns', data => {
                let id = authenticationService.getId();
                if (id !== data.userId) {
                    setIsYourTurn(false);
                    setTurnEnded(false);
                    setTurnStarted(false);
                }
            });

            // a new players turn started
            socket.on('turn started', (data) => {
                setWords([]);
                setRound(data.round);
                setWordHint(data.wordHint);
                setTurnStarted(true);
                setTurnEnded(false);
            });

            // timer updates
            socket.on('timer', time => {
                setTimer(time);
            });

            // turn ends
            socket.on('turn end', data => {
                handleTurnEnd(data.word);
                setWordHint("");
                setTimer(0);
            });
        }
    }, []);

    function handleNewGuess(data) {
        let newWord = {name: data.name, word: data.word, isCorrect: data.isCorrect};
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

    function handleWordSelection(word, difficulty) {
        socket.emit('word selected', {
            word: word,
            difficulty: difficulty
        });
        setWordHint(word);
        setChooseWords([]);
    }

    function handleTurnEnd(word) {
        setTurnEnded(true);
        setCorrectWord(word);
    }

    return (
        <div className={classes.root} >
            <div ref={gameBoardPenRef} className={classes.gameBoardPen}></div>
            <Grid className={classes.gridContainer} container spacing={3} onMouseMove={(e) => onPenMove(e)}>
                <Grid className={classes.gridItemGame} item spacing={3} xs={10}>
                    <div >
                        <Paper className={classes.gameHeaderPaper}>
                            <Grid container className={classes.gameHeader}>
                                <Grid className={classes.headerItems} item xs={1} sm={3}>{`Round: ${round}`}</Grid>
                                <Grid item xs={1} sm={6}>
                                    <h2 className={classes.wordHint}>{`${wordHint}`}</h2>
                                </Grid>
                                <Grid className={classes.headerItems} item xs={1} sm={3}>{`Time: ${timer}s`}</Grid>
                            </Grid>
                        </Paper>
                    </div>
                    <div className={classes.game} >
                        <GameBoard socketRef={socket} />
                        {!turnStarted && <div className={classes.wordPicker}>
                            <h1>{ isYourTurn ? "Choose a word:" : "Waiting for player to choose a word"}</h1>
                            { isYourTurn && <div className={classes.wordGrid}>
                                {chooseWords && chooseWords.map((word, index) => {
                                    return <Button key={index} onClick={() => handleWordSelection(word.word, word.difficulty)} 
                                        variant="contained">{word.word}</Button>
                                })}
                            </div>}
                        </div>}
                        { turnEnded && 
                            <div className={classes.wordPicker}>
                                <h1>{"Turn over"}</h1>
                                <h2>{`The correct word was: ${correctWord}`}</h2>
                            </div>
                        }
                    </div>
                </Grid>
                <Grid className={classes.gridItem} item xs={2}>
                    <Chat isYourTurn={isYourTurn} words={words} onNewWord={handleSendWord}/>
                </Grid>
            </Grid>
        </div>
    );
    
}

export default Game;