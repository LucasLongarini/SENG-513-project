import { React, useEffect, useState } from 'react';
import Background from '../../assets/images/Authpage_background.jpg';
import DoodleHeader from '../../components/DoodlerHeader.js'
import ParticipantView  from './Components/ParticipantView/ParticipantView';
import CustomizeView  from './Components/CustomizeView/CustomizeView';
import GameView from '../GameView/GameView.js';
import ChatContainer from '../ChatView/ChatContainer.js';
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
  Paper,
  Grid,
  Container,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

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
  gameHeader: {
    width: '100%',
    height: '5vh',
    textAlign: 'center',
  },
  gameHeaderPaper: {
    width: '100%',
    margin: 'auto'
  }
}));



toast.configure();
let socket;

function CreateLobbyView(props) {
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
  const [connected, setConnected] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

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

  useEffect(() => {
    if (socket !== undefined) {
      socket.on('user connected', (user) => {
        userConnected(user);
      });
  
      socket.on('user disconnected', (userId) => {
        userDisconnected(userId);
      });

      socket.on('new host', hostId => {
        setHostId(hostId);
      })
    }
  }, [users, connected])

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
    setConnected(true);
  }

  function userConnected(user) {
    if (!users.find(i => i.id === user.id)) {
      setUsers([...users, user]);
    }
  }

  function userDisconnected(userId) {
    let newUsers = users.filter(i => i.id !== userId);
    setUsers(newUsers);
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
                      <CustomizeView className='' initialRoomSettings={initialRoomSettings} roomId={roomId} updateRoom={updateRoom} setIsGameStarted={setIsGameStarted}/> :
                      <div className="CreateLobbyView-waiting">
                        <h1>Waiting for game to start...</h1>
                        <h2>{`# of rounds: ${initialRoomSettings.rounds} • Time each round: ${initialRoomSettings.timer}s`}</h2>
                      </div>)
              }
            </Grid>
        </Grid>
      </Container>
      {/* <CreateLobbyModal 
        isValidRoom={isValidRoom} 
        isHost={isHost} 
        isPrivateRoom={isPrivateRoom}
        validatePassword={validatePassword}
      /> */}
      <InviteLinkModal isOpen={isInviteLinkOpen} setIsOpen={setIsInviteLinkOpen}/>
    </div>
  )

  const renderGameHeaderContent = () => {
    return (
      <div >
        <Paper className={classes.gameHeaderPaper}>
          <Grid container className={classes.gameHeader}>
              <Grid item xs={1} sm={3}>Time</Grid>
              <Grid item xs={1} sm={3}>Round</Grid>
              <Grid item xs={1} sm={6}>{`_ _ _ W O R D _ _ _`}</Grid>
          </Grid>
        </Paper>
      </div>
    )
  }

  const renderViewContent = () => {
    if (!isGameStarted) {
      return createLobbyContent();
    }
    return (
      <GameView
        gameHeader={renderGameHeaderContent()} 
        participants={<ParticipantView handleInviteLink={handleInviteLink} users={users} hostId={hostId} sm={2} xs={12}/>}
        chat={<ChatContainer/>}
        initialRoomSettings={initialRoomSettings} 
        roomId={roomId}
        socketRef={socket}
      />
    )
  }

  return (
    renderViewContent()
  );
}

export default CreateLobbyView;