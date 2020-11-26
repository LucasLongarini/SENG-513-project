import React from 'react';
import './JoinedUser.css';
import Emojis from '../../../../assets/images/DisplayEmojis/DisplayEmojis';
import StarIcon from '@material-ui/icons/Star';

function JoinedUser(props) {
  return (
    <div className='JoinedUser-container'>
        <img className="JoinedUser-icon" alt="Username" src={Emojis[0]}></img>
        <h6>Username</h6>
        {props.isHost && <StarIcon className='leader-icon' style={{ color: "FFD700" }}/>}
    </div>
  );
}

export default JoinedUser;