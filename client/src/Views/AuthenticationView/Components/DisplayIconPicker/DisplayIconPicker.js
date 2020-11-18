import React from 'react';
import './DisplayIconPicker.css';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function DisplayIconPicker(props) {

    function increaseIndex() {
        let newIndex = (props.index + 1) % props.icons.length;
        props.setIndex(newIndex);
    }

    function decreaseIndex() {
        let newIndex = (((props.index - 1) % props.icons.length) + props.icons.length) % props.icons.length;
        props.setIndex(newIndex);
    }

    return (
        <div className='displayiconpicker-container'>
            <IconButton onClick={decreaseIndex}><ArrowBackIosIcon /></IconButton>
            <img className="displayiconpicker-emoji" alt="Logo" src={props.icons[props.index]}></img>
            <IconButton onClick={increaseIndex}><ArrowForwardIosIcon /></IconButton>
        </div>
    );
}

export default DisplayIconPicker;