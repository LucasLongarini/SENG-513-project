import React,  {Fragment, useEffect, useState }from 'react';
import './ChatView.css';
import { 
    TextField, 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    chatContainerContent: {
        width: '100%',
        height: '100%',
        display: 'inline-block',
      },
      chatContent: {
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

function ChatInput(props) {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const {
        sendMessage,
    } = props;

    const handleSubmit = (e) => {
        // setMessage(e.target.value)
        // if (e.key === 'Enter') {
        //    sendMessage(message);
        //    setMessage('');
        // }
    } 

    return (
        <TextField value={message} className="chat-input-field" id="filled-basic" label="Chat!" variant="filled" onChange={handleSubmit} onKeyDown={handleSubmit}/>
      );
    }
    
export default ChatInput;
    