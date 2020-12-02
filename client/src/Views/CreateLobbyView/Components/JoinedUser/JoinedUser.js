import React from 'react';
import './JoinedUser.css';
import Emojis from '../../../../assets/images/DisplayEmojis/DisplayEmojis';
import StarIcon from '@material-ui/icons/Star';

function JoinedUser({isHost, emojiId, name, isVisible}) {
  return (
    <div className='JoinedUser-container'>
        <img style={{visibility: isVisible ? "visible" : "hidden"}}
          className="JoinedUser-icon" alt="Username" src={Emojis[emojiId]}></img>
        <h3 style={{visibility: isVisible ? "visible" : "hidden"}}>{name}</h3>
        {isHost && <StarIcon className='leader-icon' style={{ color: "FFD700" }}/>}
    </div>
  );
}

export default JoinedUser;