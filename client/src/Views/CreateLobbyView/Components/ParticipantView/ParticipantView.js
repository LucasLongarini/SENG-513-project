import React from 'react';
import './ParticipantView.css';
import GroupIcon from '@material-ui/icons/Group';
import JoinedUser from '../JoinedUser/JoinedUser';
import {
  Grid,
  Button,
} from '@material-ui/core';

function ParticipantView({handleInviteLink, users, hostId, drawingUserId, correctUserIds}) {

  function getJoinedUsers() {
    let userList = [];
    if (users !== undefined) {

      for (let i = 0; i < users.length; i++) {
        let user = users[i];

        //only add unique users
        if (userList.find(i => i.id === user.id))
          continue;

        let isHost = user.id === hostId;
        let isDrawing = user.id === drawingUserId;
        let isCorrect = false;
        if (correctUserIds && correctUserIds.find(i => i === user.id))
          isCorrect = true;

        userList.push(<JoinedUser 
          isCorrect={isCorrect} 
          isDrawing={isDrawing} 
          key={i} 
          isVisible={true} 
          isHost={isHost} 
          emojiId={user.emojiId} 
          name={user.name}/>);
      }
    }

    for (let i=userList.length; i < 8; i++) {
      userList.push(<JoinedUser key={i} isVisible={false}/>);
    }
    return userList;
  }

  const renderContent = () => (
    <Grid item xs={12} className='ParticipantView-container'>
      <div className='ParticipantView'>
        <div className='joined-container'>
          <GroupIcon/>
          <h4>{`${users.length}/8`}</h4>
        </div>
        <div className='participant-grid'>
          {getJoinedUsers()}
        </div>
        <Button variant="contained" disableElevation style={{
          backgroundColor: "#CE5BF7",
          borderRadius: 0,
          color: "white"
        }} onClick={handleInviteLink}>
          Invite Link
        </Button>
      </div>
    </Grid>
  )

  return renderContent()
}

export default ParticipantView;