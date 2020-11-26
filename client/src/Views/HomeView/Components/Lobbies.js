import { React } from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell, 
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
} from '@material-ui/core';
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
  
  function createData(roomNumber, status, spellCheck, players) {
    return { roomNumber, status, spellCheck, players };
  }
  
  const rows = [
    createData('0001', 'Open', true, '1/8'),
    createData('0002', 'Open', false, '2/8'),
    createData('0003', 'Round 2/8', true, '3/8'),
    createData('0004', 'Open', true, '4/8'),
    createData('0005', 'Round 6/9', false, '5/8'),
    createData('0001', 'Open', true, '1/8'),
    createData('0002', 'Open', false, '2/8'),
    createData('0003', 'Round 2/8', true, '3/8'),
    createData('0004', 'Open', true, '4/8'),
    createData('0005', 'Round 6/9', false, '5/8'),
    createData('0001', 'Open', true, '1/8'),
    createData('0002', 'Open', false, '2/8'),
    createData('0003', 'Round 2/8', true, '3/8'),
    createData('0004', 'Open', true, '4/8'),
    createData('0005', 'Round 6/9', false, '5/8'),
    createData('0001', 'Open', true, '1/8'),
    createData('0002', 'Open', false, '2/8'),
    createData('0003', 'Round 2/8', true, '3/8'),
    createData('0004', 'Open', true, '4/8'),
    createData('0005', 'Round 6/9', false, '5/8'),
  ];

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

const Lobbies = (props) => {
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
              <LobbyTableCell align="right"></LobbyTableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {rows.map((row) => (
              <LobbyTableRow key={row.name}>
                <LobbyTableCell component="th" scope="row">
                  <Typography variant="h6">{row.roomNumber}</Typography>
                </LobbyTableCell>
                <LobbyTableCell align="right"><Typography variant="h6">{row.status}</Typography></LobbyTableCell>
                <LobbyTableCell align="right">{row.spellCheck ? <SpellcheckIcon color="secondary"/> : ''}</LobbyTableCell>
                <LobbyTableCell align="right"><Typography variant="h6">{row.players}</Typography></LobbyTableCell>
                <LobbyTableCell align="right"><Button variant="contained" color="secondary">JOIN</Button></LobbyTableCell>
              </LobbyTableRow>
            ))}
          </TableBody>
        </Table>
        </Scrollbars>
      </TableContainer>
    );
}

export default Lobbies;