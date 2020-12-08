import React from 'react';
import './JoinedUser.css';
import Emojis from '../../../../assets/images/DisplayEmojis/DisplayEmojis';
import StarIcon from '@material-ui/icons/Star';
import pencil from '../../../../assets/images/pencil.svg';

function JoinedUser({score, isHost, emojiId, name, isVisible, isDrawing, isCorrect}) {
  return (
    <div className={`JoinedUser-container ${isCorrect ? "JoinedUser-Correct" : "JoinedUser-Regular"}`}>
        <img style={{visibility: isVisible ? "visible" : "hidden"}}
          className="JoinedUser-icon" alt="Username" src={Emojis[emojiId]}></img>
        <h3 style={{visibility: isVisible ? "visible" : "hidden"}}>{name}</h3>
        {isHost && <StarIcon className='leader-icon' style={{ color: "FFD700" }}/>}
        {isDrawing && <img className="JoinedUser-pencil" src={pencil} />}
        {score !== undefined && <h5>{`Score: ${score}`}</h5>}
    </div>
  );
}

export default JoinedUser;