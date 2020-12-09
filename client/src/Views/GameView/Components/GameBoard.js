import { React, useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import  GameBoardOptions  from './GameBoardOptions.js'
import _ from "lodash";

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
        boxShadow: '10px 10px 0 0 rgba(0,0,0, .2)',
        userSelect: 'none',
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
        '-webkitUserDrag': 'none',
        cursor: 'none',
        width: '100%',
    },
    gameBoardBottom: {
        backgroundColor: '#999',
        borderRadius: '0 0 12px 12px',
        bottom: '0',
        // boxShadow: '4px 4px 0 0 rgba(0,0,0,.2)',
        height: '12px',
        left: '-20px',
        position: 'absolute',
        width: 'calc(100% + 40px)',
    },
}));

const GameBoard = ({socket, setDisplayPen}) => {
    const canvasRef = useRef(null);
    const [activeColor, setActiveColor] = useState('#000000');
    const [penSize, setPenSize] = useState(25);
    const [penType, setPenType] = useState('pen');
    const [isClearingBoard, setisClearingBoard] = useState(false);

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
        window.addEventListener('resize', onResize, false);
        onResize();

        if (socket) { // might have to remove this if statement to make updates work
            socket.on('drawing', data => {
                onDrawingEvent(data);

                if (noDrawingEvents) {
                    setTimeout(() => readFromQueue(false), 500);
                    noDrawingEvents = false;
                }
            });

            socket.on('clear board', data => {
                onDrawingEvent(data);

                if (noDrawingEvents) {
                    setTimeout(() => readFromQueue(false), 500);
                    noDrawingEvents = false;
                }
            });

            socket.on('fill board', data => {
                onDrawingEvent(data);

                if (noDrawingEvents) {
                    setTimeout(() => readFromQueue(false), 500);
                    noDrawingEvents = false;
                }
            });
        }

        return () => {
            window.removeEventListener('resize', onResize, false);
        }
    }, []);

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
    
        // window.addEventListener('resize', onResize, false);
        // onResize();
        
        // if (socket) {
        //     socket.on('drawing', data => {
        //         onDrawingEvent(data);

        //         if (noDrawingEvents) {
        //             setTimeout(() => readFromQueue(false), 500);
        //             noDrawingEvents = false;
        //         }
        //     });
        // }

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
        
            // window.removeEventListener('resize', onResize, false);
        }
    }, [penSize, setPenSize, activeColor, setActiveColor, penType, setPenType]);

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

    // the problem with the lag is that on the socket request it goes to 

    const fillBoard = (emit, color) => {
        const canvas = canvasRef.current;
        const w = canvas.width;
        const h = canvas.height;
        console.log('on fill')
        
        context = canvas.getContext('2d');
        context.beginPath();
        context.rect(0, 0, w, h);
        context.fillStyle = color ? color : activeColor;
        context.fill();

        if (!emit || !socket) return;
        socket.emit('fill', activeColor);
    }

    const clearBoard = (emit) => {
        const canvas = canvasRef.current;
        const w = canvas.width;
        const h = canvas.height;
        console.log('on clear')

        context = canvas.getContext('2d');
        context.clearRect(0, 0, w, h);

        if (!emit || !socket) return;
        socket.emit('clear');
    }

    const drawLine = (x0, y0, x1, y1, color, emit) => {
        if (penType === 'fill') {
            fillBoard(emit)
            return;
        }
        const penColor = penType === 'eraser' ? '#FFFFFF' : color;
        const canvas = canvasRef.current;
        const w = canvas.width;
        const h = canvas.height;

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = penColor;
        context.lineWidth = penSize;
        context.lineCap = 'round';
        context.stroke();
  
        if (!emit || !socket) return; // check this

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
        let x = _.get(evt, 'clientX') || _.get(evt, 'touches[0].clientX');
        return (x - rect.left) / (rect.right - rect.left) * canvas.width
    }

    const getYCord = (evt) => {
        const canvas = canvasRef.current;
        let rect = canvas.getBoundingClientRect();
        let y = _.get(evt, 'clientY') || _.get(evt, 'touches[0].clientY');
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
        if (canvas) {
            const parentEl = document.getElementById('gameBoard');
            canvas.width = parentEl && parentEl.clientWidth;
            canvas.height = parentEl && parentEl.clientHeight;
        }
    };

    const onDrawingEvent = (data) => {
        queue.enqueue(data);
    }

    const drawFromEvent = (data) => {
        const canvas = canvasRef.current;
        if (canvas !== null) {

            switch(data.eventType) {
                case 'clear board': {
                    clearBoard(false);
                    break;
                }
                case 'fill board': {
                    fillBoard(false, data.color);
                    break
                }
                default: {
                    const w = canvas.width;
                    const h = canvas.height;
                    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, false);
                }
            }
        }
    }
    
    return (
        <div className={classes.gameBoard} id="gameBoard" onMouseOut={() => setDisplayPen(false)} onMouseOver={() => setDisplayPen(true)}>
            <canvas ref={canvasRef} className={classes.gameBoardCanvas}/>
            <div className={classes.gameBoardBottom}></div>
            <GameBoardOptions 
                penSize={penSize}
                setPenSize={setPenSize}
                activeColor={activeColor}
                setActiveColor={setActiveColor}
                fillBoard={fillBoard}
                clearBoard={clearBoard}
                penType={penType} 
                setPenType={setPenType}
            />
        </div>
    );
}

export default GameBoard;