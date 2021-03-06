import { React, useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Background from '../../../assets/images/Authpage_background.jpg';
import DoodleHeader from '../../../components/DoodlerHeader.js'
import Lobbies from './Lobbies';
import UserProfile from './UserProfile';
import {
    Paper,
    Grid,
    Typography,
} from '@material-ui/core';
import Axios from 'axios';
import authenticationService from '../../../services/AuthenticationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

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
  gridContainer: {
    width: '100%',
    height: '100%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  lobbies: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.grey[200],
  },
  [theme.breakpoints.down('sm')]: {
    height: '65vh',
  },
  userProfile: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    height: '10vh',
  },
  logo: {
    height: '30vh',
  }
}));

const Home = (props) => {
    const classes = useStyles();
    const router = useHistory();

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
      getAllRooms();
    }, []);

    const getLoobbiesTableHeader = () => {
        return `${rooms.length ? 'We found some games that you could join!' : 'No one is playing right now :( Start a game and invite your friends!'}`
    }

    function handleLogout() {
      authenticationService.logout();
      router.push('/login');
    }

    async function handleCreate() {
        try {
          const response = await Axios.post('/room/create', {}, {
            headers: {
              token: authenticationService.getToken()
            }
          });
          router.push(`/rooms/${response.data.room.id}`);
        }
        catch {
          toast.error("Error joining room");
        }  
    }

    async function getAllRooms() {
      try {
        const response = await Axios.get('/room/all', {
          headers: {
            token: authenticationService.getToken()
          }
        });
        setRooms(response.data.rooms);
      }
      catch {}
    }

    async function handleAutoJoin() {
      try {
        const response = await Axios.get('/room/random', {
          headers: {
            token: authenticationService.getToken()
          }
        });

        router.push(`/rooms/${response.data.roomId}`);
      }
      catch {
        toast.error("No rooms found");
      }
    }

    return (
        <div className={classes.root}>
            <Grid className={classes.gridContainer} container spacing={3}>
                    <DoodleHeader />
                <Grid item xs={12} sm={8} >
                    <Paper className={classes.paper, classes.lobbies}>
                        <Typography variant="h5">{getLoobbiesTableHeader()}</Typography><br/>
                        <Lobbies refresh={getAllRooms} rooms={rooms}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4} >
                    <Paper className={classes.paper, classes.userProfile}><UserProfile handleLogout={handleLogout} handleAutoJoin={handleAutoJoin} handleCreate={handleCreate}/></Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;