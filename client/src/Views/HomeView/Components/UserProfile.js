import { React, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Emojis from '../../../assets/images/DisplayEmojis/DisplayEmojis';
import {
    Paper,
    Grid,
    Typography,
    Button,
} from '@material-ui/core';
// import Logo from '../../../../assets/images/logo.png';
import Axios from 'axios';
// import authenticationService from '../../../../services/AuthenticationService';
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

const UserProfile = (props) => {
    const classes = useStyles();
    const router = useHistory();

    return (
        <div className={classes.root}>
            <Grid className={classes.gridContainer} container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <div>
                            <img className={classes.displayIconEmoji} alt="Logo" src={Emojis[1]}></img>
                            <Typography variant="h6">UserName</Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}><Button size="large" fullWidth variant="contained" color="secondary">QUICK JOIN</Button></Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}><Button onClick={() => router.push("/create-lobby")} size="large" fullWidth variant="contained" color="secondary">CREAT LOBBY</Button></Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default UserProfile;