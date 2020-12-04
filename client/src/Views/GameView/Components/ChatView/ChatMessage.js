import React from 'react';
import { 
    Typography , 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chatMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    marginTop: '5px',
  },
  name: {
    fontWeight: '600',
    fontSize: '15 px'
  },
  text: {
    marginLeft: '10px',
    fontWeight: '400',
    fontSize: '15px'
  }
 
}));

function ChatMessage({name, text}) {
  const classes = useStyles();

  return (
      <div className={classes.chatMessageContainer}>
        <h4 className={classes.name}>{`${name}:`}</h4>
        <h4 className={classes.text}>{text}</h4>
      </div>
    );
}
    
export default ChatMessage;
    