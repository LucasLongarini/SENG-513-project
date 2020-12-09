import { React, useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Clear, Lens, FormatColorFill, Palette, ClearAll } from '@material-ui/icons';
import eraser from '../../../assets/images/eraserIcon.svg';

import {
    Popper,
    Fade,
    Paper,
    SvgIcon,
} from '@material-ui/core';
import  { CirclePicker } from 'react-color';

const LARGE_PEN_SIZE = 50;
const MEDIUM_PEN_SIZE = 25;
const SMALL_PEN_SIZE = 5;
const COLORS = ["#000000", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", 
                "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"];

const useStyles = makeStyles((theme) => ({
    optionsContainer: {
        // pointerEvents: 'none',
        alignItems: 'flex-end',
        bottom: '12px',
        display: 'flex',
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
    eraserIcon: {
        width: 24,
        height: 24,
        cursor: 'pointer',
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(0.5),

    }
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
                setPenType('eraser');
                break;
            }
        }
    }

    const getPenOptionsIcon = () => {
        switch(penType) {
            case 'pen': {
                return (<Lens color='secondary' fontSize={`${penSize === SMALL_PEN_SIZE ? 'small' : penSize === MEDIUM_PEN_SIZE ? 'default' : 'large'}`}/>);
            }
            case 'fill': {
                return (<FormatColorFill color='secondary' fontSize='large' />);
            }
            case 'eraser': {
                return (
                    <SvgIcon className={classes.eraserIcon} color='secondary' fontSize='large'>
                        <path d="M28.7,8.9l-5.7-5.7c-1.1-1.1-3.1-1.1-4.2,0l-7.1,7.1c0,0,0,0,0,0s0,0,0,0l-7.5,7.5c-1.2,1.2-1.2,3.1,0,4.2l3.8,3.8
                                c0.2,0.2,0.4,0.3,0.7,0.3h6.6c0.3,0,0.5-0.1,0.7-0.3l12.7-12.7c0,0,0,0,0,0C29.9,12,29.9,10.1,28.7,8.9z M14.9,24.1H9.2l-3.5-3.5
                                c-0.4-0.4-0.4-1,0-1.4l6.8-6.8l7.1,7.1L14.9,24.1z"/>
                        <path d="M27,28H5c-0.6,0-1,0.4-1,1s0.4,1,1,1h22c0.6,0,1-0.4,1-1S27.6,28,27,28z"/>
                    </SvgIcon>
                );
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
                        <SvgIcon className={classes.penSize} color='secondary' fontSize='default' onClick={() => handlePenOptionClick('erase')}>
                            <path d="M28.7,8.9l-5.7-5.7c-1.1-1.1-3.1-1.1-4.2,0l-7.1,7.1c0,0,0,0,0,0s0,0,0,0l-7.5,7.5c-1.2,1.2-1.2,3.1,0,4.2l3.8,3.8
                                c0.2,0.2,0.4,0.3,0.7,0.3h6.6c0.3,0,0.5-0.1,0.7-0.3l12.7-12.7c0,0,0,0,0,0C29.9,12,29.9,10.1,28.7,8.9z M14.9,24.1H9.2l-3.5-3.5
                                c-0.4-0.4-0.4-1,0-1.4l6.8-6.8l7.1,7.1L14.9,24.1z"/>
                            <path d="M27,28H5c-0.6,0-1,0.4-1,1s0.4,1,1,1h22c0.6,0,1-0.4,1-1S27.6,28,27,28z"/>
                        </SvgIcon>
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

    const closePopper = () => {
        setOpenPenPopper(false);
        setOpenColorPopper(false);
    }
    
    return (
        <Fragment>
        <div className={classes.optionsContainer} >
            <Popper open={openPenPopper || openColorPopper} anchorEl={anchorEl} placement='top' transition onMouseLeave={() => closePopper()}>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            {getMenuContent()}
                        </Paper>
                    </Fade>
                )}
            </Popper>
            <div className={classes.penSizeOptionsContainer} onClick={handleClick('pen')}>
                {getPenOptionsIcon()}
            </div>
            <div className={classes.colorOptionsContainer} onClick={handleClick('color')}>
                <Palette color='secondary' fontSize='large'/>
            </div>
            <div className={classes.colorOptionsContainer} onClick={() => clearBoard(true)}>
                <Clear color='secondary' fontSize='large' />
            </div>
        </div>
        </Fragment>
    );
}

export default GameBoardOptions;