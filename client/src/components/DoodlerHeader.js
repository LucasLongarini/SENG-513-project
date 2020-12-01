import { React } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Grid,
} from '@material-ui/core';
import Logo from '../assets/images/logo.png';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  logo: {
    width: '10%',
  }
}));

const DoodleHeader = (props) => {
    const classes = useStyles();
    const {
        xs,
        sm,
    } = props;

    return (
        <Grid item xs={xs ? xs : 12} sm={sm ? sm : 12}>
            <Paper className={classes.paper}><img className={classes.logo} alt="Logo" src={Logo}></img></Paper>
        </Grid>
    );
}

export default DoodleHeader;