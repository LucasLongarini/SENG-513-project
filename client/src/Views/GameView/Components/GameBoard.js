import { React, useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { first } from 'lodash';


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

const GameBoard = ({socket}) => {
    const canvasRef = useRef(null);
    const [activeColor, setActiveColor] = useState('black');
    let context;
    let isDrawing = false;
    let testTime = 0;
    const current = {
        color: 'black'
    };
    let noDrawingEvents = true;

    const queue = {
        items: [],
    
        enqueue: function(item) {
            this.items.push(item);                
        },
    
        dequeue: function() {
            return this.items.shift();                                                
        },
    
        peek: function(){
            return this.items[0];                  
        },
    };
    
    const classes = useStyles();

    useEffect(() => {
        const canvas = canvasRef.current;
        context = canvas.getContext('2d');
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
    
        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
    
        window.addEventListener('resize', onResize, false);
        onResize();
        
        socket.on('drawing', data => {
            onDrawingEvent(data);

            if (noDrawingEvents) {
                setTimeout(() => readFromQueue(false), 500);
                noDrawingEvents = false;
            }
        });


        // prevent memory leaks
        return () => {
            canvas.removeEventListener('mousedown', onMouseDown, false);
            canvas.removeEventListener('mouseup', onMouseUp, false);
            canvas.removeEventListener('mouseout', onMouseUp, false);
            canvas.removeEventListener('mousemove', throttle(onMouseMove, 5), false);
        
            canvas.removeEventListener('touchstart', onMouseDown, false);
            canvas.removeEventListener('touchend', onMouseUp, false);
            canvas.removeEventListener('touchcancel', onMouseUp, false);
            canvas.removeEventListener('touchmove', onMouseMove, false);
        
            window.removeEventListener('resize', onResize, false);
        }
    }, []);

    function readFromQueue(waitTime) {
        let item = queue.dequeue();
        if (item !== undefined) {
            drawFromEvent(item);

            if (waitTime)
                setTimeout(() => readFromQueue(true), item.time);
            else
                readFromQueue(true);
        }
        else {
            noDrawingEvents = true;
        }
    }

    const drawLine = (x0, y0, x1, y1, color, emit) => {
        const canvas = canvasRef.current;
        const w = canvas.width;
        const h = canvas.height;

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
        
        if (!emit) return;

        let difference;
        if (testTime === 0) {
            difference = 0;
            testTime = new Date().getTime();
        }
        else {
            let time = new Date().getTime();
            difference = time - testTime;
            testTime = time;
        }
       
        
        socket.emit('drawing1', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color,
            time: difference
        });
        
    };

    const getXCord = (evt) => {
        const canvas = canvasRef.current;
        let rect = canvas.getBoundingClientRect();
        let x = evt.clientX || evt.touches[0].clientX;
        return (x - rect.left) / (rect.right - rect.left) * canvas.width
    }

    const getYCord = (evt) => {
        const canvas = canvasRef.current;
        let rect = canvas.getBoundingClientRect();
        let y = evt.clientY || evt.touches[0].clientY;
        return (y - rect.top) / (rect.bottom - rect.top) * canvas.height
    }

    const onMouseDown = (e) => {
        isDrawing = true;
        current.X = getXCord(e);
        current.Y = getYCord(e);
    };

    const onMouseMove = (e) => {

        if (!isDrawing) {
            return;
        }
        drawLine(current.X, current.Y, getXCord(e), getYCord(e), activeColor, true);
        current.X = getXCord(e);
        current.Y = getYCord(e);
    };

    const onMouseUp = (e) => {
        if (!isDrawing || e === undefined) {
            return;
        }
        isDrawing = false;
        drawLine(current.X, current.Y, getXCord(e), getYCord(e), activeColor, true);
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
        queue.enqueue(data);
    }

    const drawFromEvent = (data) => {
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