import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chatMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: '5px',
  },
  name: {
    fontWeight: '600',
    fontSize: '15 px',
    textAlign: 'left',
  },
  text: {
    marginLeft: '10px',
    fontWeight: '400',
    fontSize: '15px'
  },
  correct: {
    fontWeight: '600',
    fontSize: '15 px',
    color: "#02DB02",
  }
 
}));

function ChatMessage({name, text, isCorrect}) {
  const classes = useStyles();

  if (!isCorrect) {
    return (
        <div className={classes.chatMessageContainer}>
          <h4 className={classes.name}>{`${name}:`}</h4>
          <h4 className={classes.text}>{text}</h4>
        </div>
      );
  }
  else {
    return (
      <div className={classes.chatMessageContainer}>
          <h4 className={classes.correct}>{`${name} guessed correctly`}</h4>
        </div>
    );
  }
}
    
export default ChatMessage;
    