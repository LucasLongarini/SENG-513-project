import React, { useRef, useState } from 'react';
import { 
    Paper,
    TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChatMessage from './ChatMessage';

const useStyles = makeStyles((theme) => ({
      chatContainer: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
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
  }));

function ChatContainer({onNewWord, words}) {

  const [word, setWord] = useState("");
  const classes = useStyles();

  function handleKeyPressed(e) {
    if (e.key === 'Enter'){
      setWord("");
      onNewWord(word.trim().toLowerCase());
    }
  }

  return (
    <Paper className={classes.chatContainer}>
        <div className={classes.chatOutputContainer}>
          { words !== undefined && 
            words.map((word, index) => <ChatMessage key={index} isCorrect={word.isCorrect} name={word.name} text={word.word}/>)
          }
        </div>
        <div className={classes.chatInputContainer}>
          <TextField value={word} onKeyDown={handleKeyPressed} 
            onChange={v => setWord(v.target.value)}
            size='small' variant='filled' 
            fullWidth label="Type your guess..." />
        </div>
    </Paper>
  );
}
    
export default ChatContainer;
    