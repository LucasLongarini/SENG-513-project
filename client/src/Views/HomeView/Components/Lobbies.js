import { React } from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Table,
    TableBody,
    TableCell, 
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Typography,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Scrollbars } from 'react-custom-scrollbars';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const LobbyTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
  
const LobbyTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxHeight: '70vh',
        overflowY: 'hidden',
    },
    scroll: {
        minHeight: '69vh',
        minWidth: 700,
    }
}));

const Lobbies = ({rooms, refresh}) => {
    const classes = useStyles();
    const router = useHistory();

    return (
        <TableContainer className={classes.tableContainer} component={Paper}>
       <Scrollbars autoHide className={classes.scroll}>
        <Table stickyHeader aria-label="lobby table">
          <TableHead>
            <TableRow>
              <LobbyTableCell>Room #</LobbyTableCell>
              <LobbyTableCell align="right">Status</LobbyTableCell>
              <LobbyTableCell align="right">Spellcheck</LobbyTableCell>
              <LobbyTableCell align="right">Players</LobbyTableCell>
              <LobbyTableCell align="right"><IconButton onClick={refresh} variant="contained" style={{color: "#ffffff"}}><RefreshIcon/></IconButton></LobbyTableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {rooms.map((room) => (
              <LobbyTableRow key={room.id}>
                <LobbyTableCell component="th" scope="row">
                  <Typography variant="h6">{room.id}</Typography>
                </LobbyTableCell>
                <LobbyTableCell align="right"><Typography variant="h6">{!room.isPrivate ? "Open" : "Private"}</Typography></LobbyTableCell>
                <LobbyTableCell align="right">{room.isSpellCheck ? <SpellcheckIcon color="secondary"/> : ''}</LobbyTableCell>
                <LobbyTableCell align="right"><Typography variant="h6">{ `${room.userIds.length}/8`}</Typography></LobbyTableCell>
                <LobbyTableCell align="right"><Button onClick={() => router.push(`/rooms/${room.id}`)} variant="contained" color="secondary">JOIN</Button></LobbyTableCell>
              </LobbyTableRow>
            ))}
          </TableBody>
        </Table>
        </Scrollbars>
      </TableContainer>
    );
}

export default Lobbies;