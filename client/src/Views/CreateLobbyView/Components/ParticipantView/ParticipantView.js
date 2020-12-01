import React from 'react';
import './ParticipantView.css';
import GroupIcon from '@material-ui/icons/Group';
import JoinedUser from '../JoinedUser/JoinedUser';
import { Button } from '@material-ui/core';

function ParticipantView({handleInviteLink, users, hostId}) {

  function getJoinedUsers() {
    let userList = [];
    if (users !== undefined) {
      userList = users.map(user => {
        let isHost = user.id == hostId;
        return <JoinedUser isVisible={true} isHost={isHost} emojiId={user.emojiId} name={user.name}/>
      });
    }

    for (let i=0; i < (8-users.length); i++) {
      userList.push(<JoinedUser isVisible={false}/>);
    }
    return userList;
  }

  return (
    <div className='ParticipantView-container'>
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
  );
}

export default ParticipantView;