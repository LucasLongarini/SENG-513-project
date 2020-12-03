import React, { useRef }from 'react';
import { 
    Paper,
    TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
      chatContainer: {
        // padding: theme.spacing(2),
        width: '100%',
        height: '100%',
      },
      chatOutputContainer: {
        height: 'calc(100% - 64px)',
        position: 'relative',
      },
      chatInputContainer: {
        padding: '3px',
        height: 'auto',
      },
  }));

function ChatContainer(props) {
    const classes = useStyles();

  return (
    <Paper className={classes.chatContainer}>
        <div className={classes.chatOutputContainer}>
 
        </div>
        <div className={classes.chatInputContainer}>
          <TextField id="filled-basic" label="Type your guess..." />
        </div>
    </Paper>
  );
}
    
export default ChatContainer;
    