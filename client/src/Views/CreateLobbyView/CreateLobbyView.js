import { React, useEffect, useState } from 'react';
import Background from '../../assets/images/Authpage_background.jpg';
import ParticipantView  from './Components/ParticipantView/ParticipantView';
import CustomizeView  from './Components/CustomizeView/CustomizeView';
import './CreateLobbyView.css';
import Axios from 'axios';
import authenticationService from '../../services/AuthenticationService';
import { useParams } from "react-router-dom";

// Should get a prop 'isHost' from the lobby view, if not then the user is a guest
function CreateLobbyView(props) {

  let { roomId } = useParams();
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoomSettings, setRoomSettings] = useState({});

  // User exits
  useEffect(() => {

    async function GetRoomInformation() {
      try {
        const response = await Axios.get(`/room/find/${roomId}`, {
          headers: {
            token: authenticationService.getToken()
          }
        });
        setIsHost(response.data.room.isHost);
        setRoomSettings(response.data.room);
        
      }
      catch {
        //TODO: display error modal and return user back to lobby;
      }
      finally {
        setIsLoading(false)
      }
    }
    GetRoomInformation();

    return () => { 
      console.log('user is exiting m8');
    }
  }, []);

  async function updateRoom(updatedData) {
    console.log('updateRoom');
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
            { isLoading ? 
              <div className="CreateLobbyView-waiting">
                  <h1>Loading...</h1>
              </div> :
              (isHost ?
                <CustomizeView initialRoomSettings={initialRoomSettings} roomId={roomId} updateRoom={updateRoom}/> :
                <div className="CreateLobbyView-waiting">
                  <h1>Waiting for game to start...</h1>
                  <h2>{`# of rounds: ${4} • Time each round: ${30}s`}</h2>
                </div>)
            }
        </div>
    </div>
  );
}

export default CreateLobbyView;