import { React, useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const useStyles = makeStyles((theme) => ({
    gameBoard: {
        position: 'relative',
        width: '100%',
        margin: '20px 0 40px 0',
        flex: '1',
    },
    gameBoardCanvas: {
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '15px 15px 0 0 rgba(0,0,0, .2)',
        userSelect: 'none',
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
        '-webkitUserDrag': 'none',
        cursor: 'none',
        width: '100%',
        // height: '100%',
    },
    gameBoardPen: {
        backgroundImage: 'url(https://maps.gstatic.com/mapfiles/santatracker/v201912242254/scenes/speedsketch/img/pen.svg);',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        top: '0',
        height: '25.5%',
        left: '0',
        position: 'absolute',
        width: 50,
        height: 50,
    }
}));

const GameBoard = (props) => {
    const canvasRef = useRef(null);
    const socketRef = useRef();
    const [activeColor, setActiveColor] = useState('black');
    let isDrawing = false;
    let currentX = '';
    let currentY = '';
    
    const classes = useStyles();
    const router = useHistory();

    useEffect(() => {
        console.log('main use effect')
        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 5), false);
    
        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', onMouseMove, false);
    
        window.addEventListener('resize', onResize, false);
        onResize();
    
        // socket func
        // socketRef.current = io.connect('/');
        // socketRef.current.on('drawing', onDrawingEvent);
    }, []);

    const drawLine = (x0, y0, x1, y1, color, emit) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 10;
        context.stroke();
        // context.closePath();
  
        if (!emit) return;

        const w = canvas.width;
        const h = canvas.height;
  
      //   socketRef.current.emit('drawing', {
      //     x0: x0 / w,
      //     y0: y0 / h,
      //     x1: x1 / w,
      //     y1: y1 / h,
      //     color,
      //   });
    };

    const getXCord = (evt) => {
        const canvas = canvasRef.current;
        var rect = canvas.getBoundingClientRect();
        return (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width
    }

    const getYCord = (evt) => {
        const canvas = canvasRef.current;
        var rect = canvas.getBoundingClientRect();
        return (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    }

    const onMouseDown = (e) => {
        isDrawing = true;
        currentX = getXCord(e);
        currentY = getYCord(e);
    };

    const onMouseMove = (e) => {
        if (!isDrawing) {
            return;
        }
        drawLine(currentX, currentY, getXCord(e), getYCord(e), activeColor, true);
        currentX = getXCord(e);
        currentY = getYCord(e);
    };

    const onMouseUp = (e) => {
        if (!isDrawing) {
            return;
        }
        isDrawing = false;
        drawLine(currentX, currentY, getXCord(e), getYCord(e), activeColor, true);
    };

    const throttle = (callback, delay) => {
        let previousCall = new Date().getTime();
        return function() {
            const time = new Date().getTime();
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    };

    const onResize = () => {
        const canvas = canvasRef.current;
        const parentEl = document.getElementById('gameBoard');
        canvas.width = parentEl && parentEl.clientWidth;
        canvas.height = parentEl && parentEl.clientHeight;
    };

    const onDrawingEvent = (data) => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const w = canvas.width;
            const h = canvas.height;
            drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
        }
    }
    
    return (
        <div className={classes.gameBoard} id="gameBoard" >
            <canvas ref={canvasRef} className={classes.gameBoardCanvas}/>
        </div>
    );
}

export default GameBoard;