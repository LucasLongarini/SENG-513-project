import React, {useState, useEffect } from 'react';
import { 
    Paper,
    TextField,
    Popper,
    Fade,
    Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChatMessage from './ChatMessage';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
      chatContainer: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxShadow: '10px 10px 0 0 rgba(0,0,0, .2)',
      },
      chatOutputContainer: {
        overflowY: 'auto',
        flex: '1',
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        paddingRight: theme.spacing(1.5),
        paddingLeft: theme.spacing(1.5),
      },
      chatInputContainer: {
        padding: theme.spacing(1.5),
        height: 'auto',
      },
      chatHeader: {
        margin: 'auto',
        padding: '10px 0 5px 0',
        fontWeight: '400',
        fontSize: '20px'
      },
      wordOptions: {
        padding: theme.spacing(1),
        verticalAlign: 'baseline', 
        alignItems: 'flex-end',
        display: 'flex',
    },
    word: {
      cursor: 'pointer',
  },
  }));

function ChatContainer({
    onNewWord,
    words,
    isYourTurn, 
    isSpellCheck,
    onKeyDown,
    setMissSpelledWords,
    missSpelledWords,
    suggetions,
  }) {

  const [word, setWord] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopper, setOpenPopper] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (_.get(missSpelledWords, 'length') > 0) {
      setOpenPopper(true);
    }
  }, [missSpelledWords, word]);


  function handleKeyPressed(e) {
    setAnchorEl(e.currentTarget);

    if (e.key === 'Enter'){
      setWord("");
      onNewWord(word.trim().toLowerCase());
    }
  }

  const handleOnChange = (v) => {
    if (isSpellCheck) {
      onKeyDown(v.target.value)
    }
    setWord(v.target.value)
  }

  const handleSuggestionClick = (newWord) => {
    setWord(_.replace(word, _.get(missSpelledWords, '[0]'), newWord))
    setMissSpelledWords([]);
  }

  const closePopper = () => {
    setOpenPopper(false);
  }

  const getMenuContent = () => {
    if ((_.get(missSpelledWords, 'length') > 0) && _.get(suggetions, '[0].length') > 0) {
      return (
        <div className={classes.wordOptions}>
          {suggetions[0].map((newWord, index) => (index < 3) && <Chip onClick={() => handleSuggestionClick(newWord)} className={classes.word} label={newWord} color="secondary"/>)}
        </div>
      )
    }
  }

  return (
    <Paper className={classes.chatContainer}>
        <Popper open={openPopper} anchorEl={anchorEl} placement='top' transition onMouseLeave={() => closePopper()}>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                        {getMenuContent()}
                    </Paper>
                </Fade>
            )}
        </Popper>
        <h2 className={classes.chatHeader}>Guesses</h2>
        <div className={classes.chatOutputContainer}>
          { words !== undefined && 
            words.map((word, index) => <ChatMessage key={index} isCorrect={word.isCorrect} name={word.name} text={word.word}/>)
          }
        </div>
        <div className={classes.chatInputContainer}>
          { !isYourTurn && 
              <TextField value={word} onKeyDown={handleKeyPressed} 
                onChange={v => handleOnChange(v)}
                size='small' variant='filled' 
                fullWidth label="Type your guess..."
                error={_.get(missSpelledWords, 'length') > 0} 
              />
            }
        </div>
    </Paper>
  );
}
    
export default ChatContainer;
    