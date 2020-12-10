import { React } from 'react';
import clockImage from '../../../../assets/images/clock.svg';
import "./Timer.css";

function Timer({time}) {
    return (
        <div className="Timer">
            <img className="Timer-image" src={ clockImage } />
            <h5 className="Timer-text">{`${time}s`}</h5>
        </div>
    );
}

export default Timer;