import React from 'react';
import './ParticipantView.css';
import GroupIcon from '@material-ui/icons/Group';
import JoinedUser from '../JoinedUser/JoinedUser';
import {
  Grid,
  Button,
} from '@material-ui/core';

function ParticipantView({handleInviteLink, users, hostId, xs, sm}) {

  function getJoinedUsers() {
    let userList = [];
    if (users !== undefined) {
      userList = users.map((user, index) => {
        let isHost = user.id == hostId;
        return <JoinedUser key={index} isVisible={true} isHost={isHost} emojiId={user.emojiId} name={user.name}/>
      });
    }

    for (let i=users.length; i < 8; i++) {
      userList.push(<JoinedUser key={i} isVisible={false}/>);
    }
    return userList;
  }

  const renderContent = () => (
    <Grid item xs={xs ? xs : 12} sm={sm ? sm : 12} className='ParticipantView-container'>
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