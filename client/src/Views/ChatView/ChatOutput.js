import React,  {Fragment, useEffect, useState, useRef }from 'react';
import './ChatView.css';
import { 
    Typography , 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    chatOutputField: {
        position: 'absolute', 
        bottom: '15px',
        left: 0,
        width: 'calc(100% - 10px)',
        display: 'inline-block',
        padding: '5px',
        overflowY: 'auto',
        maxHeight: 'calc(100% - 28px)',
      },
      messageBubbleRight: {
        padding: '5px',
        width: 'calc(100% - 10px)',
        height: '40px',
        marginTop: '15px',
      },
      
      messageBubbleLeft: {
        padding: '5px',
        width: 'calc(100% - 10px)',
        height: '40px',
        marginTop: '10px',
      },

      messageFillerLeft: {
        width: 'auto',
        float: 'left',
        paddingTop: '12px',
        paddingBottom: '10px',
      },
      
      messageContentRight: {
        width: 'auto',
        padding: '5px',
        height: 'calc(100% - 10px)',
        float: 'right',
        /* background-color: aqua; */
        borderRadius: '15px',
      },
      
      messageContentLeft: {
        height: '100%',
        float: 'left',
      },
      
      messageFillerRight: {
        width: 'auto',
        float: 'right',
      },
      
      messageContentUsername: {
        marginLeft: '5px',
        float: 'left',
      },
      
      messageContentMessage: {
        height: 'calc(100% - 12px)',
        float: 'left',
        width: 'auto',
        /* background-color: plum; */
        borderRadius: '10px',
        padding: '5px',
      }
  }));

function ChatOutput(props) {
    const classes = useStyles();
    const endOfChatOutput = useRef();
    const {
        messages,
        user,
        users,
    } = props;

    useEffect(() => {
        scrollToBottom();
      }, [messages]);

    const scrollToBottom = () => {
        endOfChatOutput.current.scrollIntoView({ behavior: 'smooth' })
    }

    const renderMessageitem = (message) => {
        if (message.userId === user.userId) {
            let usersColor = '';
            let userName = '';
            for (let i = 0; i < users.length; i++) {
                if (users[i] && users[i].userId === message.userId) {
                    usersColor = users[i].color;
                }
            }
            return (
                <div className={classes.messageBubbleRight}>
                    <div className={classes.messageFillerLeft}><Typography variant="caption" color="textSecondary">{message.formatedTimeStamp}</Typography></div>
                    <div className={classes.messageContentRight} style={{backgroundColor: usersColor}}>{message.message}</div>
                </div>
            )
        }
        let usersColor = '';
        let userName = '';
        for (let i = 0; i < users.length; i++) {
            if (users[i] && users[i].userId === message.userId) {
                usersColor = users[i].color;
                userName = users[i].userName;
            }
        }
        return (
            <div className={classes.messageBubbleLeft}>
                <div className={classes.messageContentLeft}>
                    <div className={classes.messageContentUsername}><Typography variant="caption" color="textSecondary">{`${userName} ${message.formatedTimeStamp}`}</Typography></div>
                    <br/>
                    <div className={classes.messageContentMessage} style={{backgroundColor: usersColor}}>{message.message}</div>
                </div>
                <div className={classes.messageFillerRight}></div>
            </div>
        )
    }

    const renderMessages = () => {
        if ( messages && messages.length > 0) {
            const messageBubbles = []
            for (let i = 0; i < messages.length; i = i +1) {
                messageBubbles.push(renderMessageitem(messages[i]));
            }
            return messageBubbles;
        } else {
            return (
                <div>
                    No messages yet :( Send a chat to get the convo going!
                </div>
            )
        }
    }

    return (
        <div className={classes.chatOutputField}>
            {renderMessages()}
            <div ref={endOfChatOutput} />
        </div>
      );
    }
    
export default ChatOutput;
    