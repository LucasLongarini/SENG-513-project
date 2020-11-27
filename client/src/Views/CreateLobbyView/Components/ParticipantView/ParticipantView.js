import React from 'react';
import './ParticipantView.css';
import GroupIcon from '@material-ui/icons/Group';
import JoinedUser from '../JoinedUser/JoinedUser';
import { Button } from '@material-ui/core';

function ParticipantView({handleInviteLink}) {
  return (
    <div className='ParticipantView-container'>
      <div className='joined-container'>
        <GroupIcon/>
        <h4>8/8</h4>
      </div>
      <div className='participant-grid'>
        <JoinedUser isHost={true}/>
        <JoinedUser />
        <JoinedUser />
        <JoinedUser />
        <JoinedUser />
        <JoinedUser />
        <JoinedUser />
        <JoinedUser />
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