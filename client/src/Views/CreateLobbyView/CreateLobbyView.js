import { React, useEffect, useState } from 'react';
import Background from '../../assets/images/Authpage_background.jpg';
import DoodleHeader from '../../components/DoodlerHeader.js'
import ParticipantView  from './Components/ParticipantView/ParticipantView';
import CustomizeView  from './Components/CustomizeView/CustomizeView';
import GameView from '../GameView/GameView.js';
import './CreateLobbyView.css';
import Axios from 'axios';
import authenticationService from '../../services/AuthenticationService';
import { useParams } from "react-router-dom";
import CreateLobbyModal from './Components/CreateLobbyModal/CreateLobbyModal';
import InviteLinkModal from './Components/InviteLinkModal/InviteLinkModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import {
  Grid,
  Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSound from 'use-sound';

import userLeftSound from '../../assets/sounds/userLeft.mp3';
import userJoinedSound from '../../assets/sounds/userJoined.mp3';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${Background})`,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 'auto',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    minHeight: '600px',
  },
  gridContainer: {
    width: '100%',
    height: '100%',
  },
  customizeViewGridItem: {
    display: 'flex',
    width: 'auto',
    height: '80%',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    }
  },
}));

toast.configure();
let socket;

function CreateLobbyView() {
  const classes = useStyles();

  let { roomId } = useParams();
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [initialRoomSettings, setRoomSettings] = useState({});
  const [isValidRoom, setIsValidRoom] = useState(true);
  const [isInviteLinkOpen, setIsInviteLinkOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [hostId, setHostId] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState("-");
  const [rounds, setRounds] = useState("-");
  const [errorMessage, setErrorMessage] = useState("");
  const [drawingUserId, setDrawingUserId] = useState("");
  const [correctUserIds, setCorrectUserIds] = useState([]);
  const [canStartGame, setCanStartGame] = useState(false);
  const [playJoinedSound] = useSound(userJoinedSound);
  const [playLeftSound] = useSound(userLeftSound);

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
        setUsers(response.data.room.users);
        setHostId(response.data.room.hostId);
        setTimer(response.data.room.timer);
        setRounds(response.data.room.rounds);
        
        if (response.data.room.isHost)
          connectToRoom();
        else if (!response.data.room.isPrivate)
          connectToRoom();
        
      }
      catch {
        setIsValidRoom(false);
        setErrorMessage("This room does not exist");
      }
      finally {
        setIsLoading(false)
      }
    }
    GetRoomInformation();

    window.addEventListener("beforeunload", handleRefresh);
    
    return () => { 
      window.removeEventListener("beforeunload", handleRefresh);
      if (socket) {
        socket.disconnect();
      }
    }
  }, []);

  useEffect(() => {
    setCanStartGame(users.length > 1);
  }, [users]);

  function handleRefresh(e) {
    var confirmationMessage = 'Your place will be reset, are you sure you want to refresh?';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  }

  async function updateRoom(updatedData) {
    try {

      if (updatedData.rounds !== undefined && socket !== undefined) {
        socket.emit('update room settings', {rounds : updatedData.rounds});
      }

      if (updatedData.timer !== undefined && socket !== undefined) {
        socket.emit('update room settings', {timer : updatedData.timer});
      }


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

    socket.on('force disconnect', () => {
      disconnect();
    });
    socket.on('game in progress', (game) => {
      goToGame();
    });
    socket.on('game start', () => {
      setIsGameStarted(true);
    });
    socket.on('switch turns', data => {
      setDrawingUserId(data.userId);
    });
    socket.on('correct guess', userId => {
      setCorrectUserIds(oldIds => [...oldIds, userId]);
    });
    socket.on('user connected', (user) => {
      userConnected(user);
    });
    socket.on('user disconnected', (userId) => {
      userDisconnected(userId);
    });
    socket.on('new host', hostId => {
      newHost(hostId);
    });
    socket.on('new room settings', (data) => {
      if (data.timer !== undefined) {
        setTimer(data.timer);
      }
      if (data.rounds !== undefined) {
        setRounds(data.rounds);
      }
    });
    socket.on('turn started', () => {
      setCorrectUserIds([]);
    });
  }

  function goToGame() {
    setIsGameStarted(true);
  }

  function userConnected(user) {
    playJoinedSound();
    setUsers(oldUsers => [...oldUsers, user]);
  }

  function userDisconnected(userId) {
    playLeftSound();
    setUsers(oldUsers => oldUsers.filter(i => i.id !== userId));
  }

  function newHost(hostId) {
    setHostId(hostId);
    if (hostId.toString() === authenticationService.getId() && !isHost) {
      setIsHost(true);
    }
  }

  function startGame() {
    if (isHost && socket !== undefined) {
      socket.emit('start game');
    }
  }

  function disconnect() {
    console.log('disconnected');
    socket.disconnect();
    setErrorMessage("The room is full");
    setIsValidRoom(false);
  }

  const createLobbyContent = () => (
    <div className={classes.root}>
      <Container className={classes.container} maxWidth='md'>
        <Grid className={classes.gridContainer} container spacing={3}>
            <Grid item xs={12} className={classes.header}> 
              <DoodleHeader />
            </Grid>
            <Grid item xs={12} md={4} className={classes.customizeViewGridItem}> 
              <ParticipantView handleInviteLink={handleInviteLink} users={users} hostId={hostId}/>
            </Grid>
            <Grid item xs={12} md={8} className={classes.customizeViewGridItem}>
              { isLoading ? 
                    <div className="CreateLobbyView-waiting">
                        <h1>Loading...</h1>
                    </div> :
                    (isHost ?
                      <CustomizeView canStartGame={canStartGame} className='' initialRoomSettings={initialRoomSettings} roomId={roomId} updateRoom={updateRoom} startGame={startGame}/> :
                      <div className="CreateLobbyView-waiting">
                        <h1>Waiting for game to start...</h1>
                        <h2>{`# of rounds: ${rounds} • Time each round: ${timer}s`}</h2>
                      </div>)
              }
            </Grid>
        </Grid>
      </Container>
      <CreateLobbyModal 
        isValidRoom={isValidRoom} 
        errorMessage={errorMessage}
        isHost={isHost} 
        isPrivateRoom={isPrivateRoom}
        validatePassword={validatePassword}
      />
      <InviteLinkModal isOpen={isInviteLinkOpen} setIsOpen={setIsInviteLinkOpen}/>
    </div>
  )

  const renderViewContent = () => {
    if (!isGameStarted) {
      return createLobbyContent();
    }
    return (
      <div className={classes.root}>
        <Grid className={classes.gridContainer} container spacing={3}>
            <Grid item xs={12} className={classes.header}> 
              <DoodleHeader />
            </Grid>
            <Grid item xs={2} className={classes.customizeViewGridItem}> 
              <ParticipantView correctUserIds={correctUserIds} drawingUserId={drawingUserId} handleInviteLink={handleInviteLink} users={users} hostId={hostId}/>
            </Grid>
            <Grid item xs={10} className={classes.customizeViewGridItem}>
              {
                <GameView
                  roomId={roomId}
                  socket={socket}
                />
              }
            </Grid>
        </Grid>
        <CreateLobbyModal 
          isValidRoom={isValidRoom} 
          errorMessage={errorMessage}
          isHost={isHost} 
          isPrivateRoom={isPrivateRoom}
          validatePassword={validatePassword}
        />
        <InviteLinkModal isOpen={isInviteLinkOpen} setIsOpen={setIsInviteLinkOpen}/>
      </div>
    )
  }

  return renderViewContent();
}

export default CreateLobbyView;