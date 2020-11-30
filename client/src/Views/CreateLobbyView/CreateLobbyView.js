import { React, useEffect, useState } from 'react';
import Background from '../../assets/images/Authpage_background.jpg';
import ParticipantView  from './Components/ParticipantView/ParticipantView';
import CustomizeView  from './Components/CustomizeView/CustomizeView';
import './CreateLobbyView.css';
import Axios from 'axios';
import authenticationService from '../../services/AuthenticationService';
import { useParams } from "react-router-dom";
import CreateLobbyModal from './Components/CreateLobbyModal/CreateLobbyModal';
import InviteLinkModal from './Components/InviteLinkModal/InviteLinkModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

toast.configure();
let socket;

function CreateLobbyView(props) {

  let { roomId } = useParams();
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [initialRoomSettings, setRoomSettings] = useState({});
  const [isValidRoom, setIsValidRoom] = useState(true);
  const [isInviteLinkOpen, setIsInviteLinkOpen] = useState(false);

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
        setIsPrivateRoom(response.data.room.isPrivate);
        setIsValidRoom(true);
        
        if (response.data.room.isHost)
          connectToRoom();
        else if (!response.data.room.isPrivate)
          connectToRoom();
        
      }
      catch {
        setIsValidRoom(false);
      }
      finally {
        setIsLoading(false)
      }
    }
    GetRoomInformation();

    return () => { 
      if (socket) {
        socket.disconnect();
      }
    }
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
      toast.error("Error updaing values")
    }
  }

  async function validatePassword(password) {
    try {
      await Axios.post(`/room/join/${roomId}`, 
      {
        password: password
      }, 
      {
        headers: {
          token: authenticationService.getToken()
        }
      });
      setIsPrivateRoom(false);
      connectToRoom();
    }
    catch (err){
      toast.error("Incorrect password")

    }
  }

  function handleInviteLink() {
    setIsInviteLinkOpen(true);
  }

  function connectToRoom() {
    socket = io({
      query: {
        token: authenticationService.getToken(),
        roomId: roomId,
      }
    });

    socket.on('user joined', () => {
      console.log('user joined');
    });
  }

  return (
    <div className='CreateLobbyView' style={{ backgroundImage: `url(${Background})` }}>     
        <div className='CreateLobbyView-container'>
            <ParticipantView handleInviteLink={handleInviteLink}/>
            { isLoading ? 
              <div className="CreateLobbyView-waiting">
                  <h1>Loading...</h1>
              </div> :
              (isHost ?
                <CustomizeView initialRoomSettings={initialRoomSettings} roomId={roomId} updateRoom={updateRoom}/> :
                <div className="CreateLobbyView-waiting">
                  <h1>Waiting for game to start...</h1>
                  <h2>{`# of rounds: ${initialRoomSettings.rounds} • Time each round: ${initialRoomSettings.timer}s`}</h2>
                </div>)
            }
        </div>
        <CreateLobbyModal 
          isValidRoom={isValidRoom} 
          isHost={isHost} 
          isPrivateRoom={isPrivateRoom}
          validatePassword={validatePassword}
        />
        <InviteLinkModal isOpen={isInviteLinkOpen} setIsOpen={setIsInviteLinkOpen}/>
    </div>
  );
}

export default CreateLobbyView;