import { React, useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Clear, Lens, FormatColorFill, Palette, ClearAll } from '@material-ui/icons';
import {
    Popper,
    Fade,
    Paper,
} from '@material-ui/core';
import  { CirclePicker } from 'react-color';

const LARGE_PEN_SIZE = 50;
const MEDIUM_PEN_SIZE = 25;
const SMALL_PEN_SIZE = 5;
const COLORS = ["#000000", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", 
                "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"];


const useStyles = makeStyles((theme) => ({
    optionsContainer: {
        alignItems: 'flex-end',
        bottom: '12px',
        display: 'flex',
        height: '20%',
        // left: '90%',
        right: '2%',
        position: 'absolute',
    },
    penSizeOptionsContainer: {
        cursor: 'pointer',
    },
    penSizeOptions: {
        padding: theme.spacing(2),
        verticalAlign: 'baseline', 
        alignItems: 'flex-end',
        display: 'flex',
    },
    penSize: {
        cursor: 'pointer',
        margin: theme.spacing(1),
    },
    colorOptionsContainer: {
        cursor: 'pointer',

    },
    colorSizeOptions: {
        padding: theme.spacing(2),
    },
    clearOptionContainer: {
        cursor: 'pointer',
        top: '12px',
        display: 'flex',
        height: '20%',
        left: '95%',
        position: 'absolute',

    },
}));

const GameBoardOptions = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openColorPopper, setOpenColorPopper] = useState(false);
    const [openPenPopper, setOpenPenPopper] = useState(false);
    const [menuContent, setMenuContent] = useState();

    const {
        penSize,
        setPenSize,
        activeColor,
        setActiveColor,
        clearBoard,
        fillBoard,
        penType,
        setPenType,
    } = props;

    useEffect(() => {
    }, [penSize, setPenSize, activeColor, setActiveColor]);

    const handleClick = (option) => (event) => {
        setMenuContent(option)
        setAnchorEl(event.currentTarget);
        if (option === 'pen') {
            setOpenPenPopper(!openPenPopper);
            setOpenColorPopper(false);
        } else {
            setOpenColorPopper(!openColorPopper);
            setOpenPenPopper(false);
        }
    };

    const handleColorChangeComplete = (color) => {
        setActiveColor(color.hex)
      };

    const handlePenOptionClick = (optionType) => {
        switch(optionType) {
            case 'small': {
                setPenType('pen');
                setPenSize(SMALL_PEN_SIZE);
                break;
            }
            case 'default': {
                setPenType('pen');
                setPenSize(MEDIUM_PEN_SIZE);
                break;
            }
            case 'large': {
                setPenType('pen');
                setPenSize(LARGE_PEN_SIZE);
                break;
            }
            case 'fill': {
                setPenType('fill')
                break;
            }
            case 'erase': {
                setPenType('pen');
                setActiveColor('#FFFFFF')
                break;
            }
        }
    }

    const getMenuContent = () => {
        switch(menuContent){
            case 'pen': {
                return (
                    <div className={classes.penSizeOptions}>
                        <Lens className={classes.penSize} color='secondary' fontSize='small' onClick={() =>  handlePenOptionClick('small')}/>
                        <Lens className={classes.penSize} color='secondary' fontSize='default' onClick={() => handlePenOptionClick('default')}/>
                        <Lens className={classes.penSize} color='secondary' fontSize='large' onClick={() => handlePenOptionClick('large')}/>
                        <FormatColorFill className={classes.penSize} color='secondary' fontSize='large' onClick={() => handlePenOptionClick('fill')}/>
                        <ClearAll className={classes.penSize} color='secondary' fontSize='large' onClick={() => handlePenOptionClick('erase')}/>
                    </div>
                )
            }
            case 'color': {
                return (
                    <div className={classes.colorSizeOptions}>
                        <CirclePicker
                            onChangeComplete={handleColorChangeComplete}
                            color={activeColor}
                            colors={COLORS} 
                        />
                    </div>
                )
            }
            default: {
                return ''
            }
        }
    }
    
    return (
        <Fragment>
        <div className={classes.optionsContainer}>
            <Popper open={openPenPopper || openColorPopper} anchorEl={anchorEl} placement='top' transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            {getMenuContent()}
                        </Paper>
                    </Fade>
                )}
            </Popper>
            <div className={classes.penSizeOptionsContainer} onClick={handleClick('pen')}>
                <Lens color='secondary' fontSize={`${penSize === SMALL_PEN_SIZE ? 'small' : penSize === MEDIUM_PEN_SIZE ? 'default' : 'large'}`}/>
            </div>
            <div className={classes.colorOptionsContainer} onClick={handleClick('color')}>
                <Palette color='secondary' fontSize='large'/>
            </div>
            <div className={classes.colorOptionsContainer}>
                <Clear color='secondary' fontSize='large' onClick={() => clearBoard(true)}/>
            </div>
        </div>
        { false &&        
            <div className={classes.clearOptionContainer}>
                <Clear color='secondary' fontSize='large' onClick={() => clearBoard(true)}/>
            </div>
        }
        </Fragment>
    );
}

export default GameBoardOptions;