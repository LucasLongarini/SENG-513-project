import { React } from 'react';
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
}));

const displayName = authenticationService.getDisplayName();
const emojiId = authenticationService.getEmojiId();

const UserProfile = ({ handleCreate }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid className={classes.gridContainer} container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <div>
                            <img className={classes.displayIconEmoji} alt="User Icon" src={Emojis[emojiId]}></img>
                            <Typography variant="h6">{displayName}</Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}><Button size="large" fullWidth variant="contained" color="secondary">QUICK JOIN</Button></Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}><Button onClick={handleCreate} size="large" fullWidth variant="contained" color="secondary">CREAT LOBBY</Button></Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default UserProfile;