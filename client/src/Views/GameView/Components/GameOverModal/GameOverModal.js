import React from 'react';
import Modal from 'react-modal';
import './GameOverModal.css';
import {Button} from '@material-ui/core';
import Emojis from '../../../../assets/images/DisplayEmojis/DisplayEmojis';
import { useHistory } from 'react-router-dom';


function GameOverModal({isOpen, topUsers, handlePlayAgain}) {
    const router = useHistory();

    function createPodium(place, name, emojiId) {

        let height;
        let placeText;
        let color;
        switch (place) {
            case 1:
                height = "90%";
                placeText="1st";
                color = "#ffd700";
                break;
            case 2:
                height = "70%";
                placeText = "2nd";
                color = "#C0C0C0";
                break;
            case 3:
                height = "50%";
                placeText = "3rd";
                color = "#cd7f32";
                break;
            default:
                height = "0%";
                placeText = "";
                color="#ffffff";
                break;
        }

        return (
            <div style={{height: height}} className="GameOverModal-place">
                <img src={Emojis[emojiId]}/>
                <h4>{name}</h4>
                <div className="GameOverModal-podium" style={{backgroundColor: color}}></div>
                <h3>{placeText}</h3>
            </div>
        );
    }

    function getPlaces(place) {
        if (topUsers !== undefined) {
            let user = topUsers.find(i => i.place === place);
            if (user !== undefined) {
                return createPodium(place, user.name, user.emojiId);
            }
        }
    }

    function goToHome() {
        router.push('/');
    }

    return (
        <Modal overlayClassName='GameOverModal-overlay' className='GameOverModal-content' isOpen={isOpen}>
            <div className="GameOverModal-container">
                <h1>Game Over</h1>
                <div className="GameOverModal-places">
                    {getPlaces(2)}
                    {getPlaces(1)}
                    {getPlaces(3)}
                </div>
                <div className="GameOverModal-buttons">
                    <Button onClick={goToHome} style={{width: '40%'}} variant="contained">Leave</Button>
                    <Button onClick={handlePlayAgain} style={{width: '40%'}} variant="contained" color="secondary">Play Again</Button>
                </div>
            </div>
        </Modal>
      );
}


export default GameOverModal;