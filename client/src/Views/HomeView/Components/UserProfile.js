import { React, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Emojis from '../../../assets/images/DisplayEmojis/DisplayEmojis';
import {
    Paper,
    Grid,
    Typography,
    Button,
} from '@material-ui/core';
import authenticationService from '../../../services/AuthenticationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  displayIconEmoji: {
    width: '33%',
  },
  bigButton: {
      height: '100%',
      width: '100%',
  },
  logoutGrid: {
      display: 'flex',
      justifyContent: 'flex-end',
  },
  logoutButton: {
      fontSize: '1rem',
  }
}));

const UserProfile = ({ handleCreate, handleAutoJoin, handleLogout }) => {
    const classes = useStyles();

    const [isGuest, setisGuest] = useState(false);
    const [emojiId, setEmojiId] = useState(0);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        setDisplayName(authenticationService.getDisplayName());
        setEmojiId(authenticationService.getEmojiId());
        setisGuest(authenticationService.getIsGuest());
    }, []);

    return (
        <div className={classes.root}>
            <Grid className={classes.gridContainer} container spacing={3}>
                <Grid className={classes.logoutGrid} item xs={12}>
                    <Button className={classes.logoutButton} color="secondary" onClick={handleLogout}>Logout</Button>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <div>
                            <img className={classes.displayIconEmoji} alt="User Icon" src={Emojis[emojiId]}></img>
                            <Typography variant="h6">{displayName}</Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button onClick={handleAutoJoin} size="large" fullWidth variant="contained" color="secondary">QUICK JOIN</Button>
                </Grid>
                { !isGuest &&
                <Grid item xs={12} sm={12}>
                    <Button onClick={handleCreate} size="large" fullWidth variant="contained" color="secondary">CREAT LOBBY</Button>
                </Grid>
                }
            </Grid>
        </div>
    );
}

export default UserProfile;