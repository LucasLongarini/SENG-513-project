import { React, useEffect, useState } from 'react';
import Background from '../../assets/images/Authpage_background.jpg';
import ParticipantView  from './Components/ParticipantView/ParticipantView';
import CustomizeView  from './Components/CustomizeView/CustomizeView';
import './CreateLobbyView.css';
import Axios from 'axios';
import authenticationService from '../../services/AuthenticationService';

// Should get a prop 'isHost' from the lobby view, if not then the user is a guest
function CreateLobbyView(props) {

  const [roomId, setRoomId] = useState("-");

  useEffect(() => {
    async function createRoom() {
      try {
        const response = await Axios.post('/room/create', {}, {
          headers: {
            token: authenticationService.getToken()
          }
        });
        setRoomId(response.data.room.id);
      }
      catch {
         //TODO display error
      } 
    }
    createRoom();
  }, []);

  async function updateRoom(updatedData) {
    try {
      await Axios.patch(`/room/${roomId}`, updatedData, {
        headers: {
          token: authenticationService.getToken()
        }
      });
    }
    catch (err){
      //TODO display error
      console.log(err);
    }
  }

  return (
    <div className='CreateLobbyView' style={{ backgroundImage: `url(${Background})` }}>     
        <div className='CreateLobbyView-container'>
            <ParticipantView />
            <CustomizeView roomId={roomId} updateRoom={updateRoom}/>
        </div>
    </div>
  );
}

export default CreateLobbyView;