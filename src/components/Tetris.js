import React, {useState} from 'react';
import { createStage, checkCollision } from './gameHelpers';
//components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import StopButton from './StopButton';
//Styled components
import { StyledTetrisWrapper } from './styles/StyledTetris';
import { StyledTetris } from './styles/StyledTetris';

//Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval'
import { useGameStatus } from '../hooks/useGameStatus'


const Tetris = () => {
    // console.log(createStage())
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);


    const [player, updatePlayerPosition, resetPlayer, playerRotate , stopPlayer] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    console.log("re-render");

    const movePlayer = direction => {
        if(!checkCollision(player, stage, {x: direction, y: 0 })) {
            updatePlayerPosition({x: direction, y: 0})
        }
        
    }

    const startGame =() => {
        console.log("test start game")
        //Reset everything
        setStage(createStage());
        resetPlayer();
        setGameOver(false);
        setDropTime(1000);
        setScore(0);
        setRows(0);
        setLevel(0);
        

    }

    const stopGame = () => {
        console.log("game stop")
        // setGameOver(true);
        stopPlayer()
        
        setDropTime(null);
        // resetPlayer();
        // // setStage(createStage());
        // setStop();
        // setScore(0);
        // setRows(0);
        // setLevel(0);
    }

    const drop = () => {
        //Increase level when player clears 10 rows
        if(rows > (level + 1)*10) {
            setLevel(prevState => prevState + 1)
            //increase speed
            setDropTime(1000 / (level + 1)+200)
        }
        if(!checkCollision(player, stage, {x: 0, y: 1 })) {
            updatePlayerPosition({x: 0 , y: 1 , collided: false})

        }else {
            //GameOVER 
            if(player.position.y < 1){
                console.log("GAME OVER")
                setGameOver(true)
                setDropTime(null)

            }
            
            updatePlayerPosition({x:0, y:0, collided:true})
        }
        
    

    }

    const keyUp = ({keyCode}) => {
        if(!gameOver) {
            if(keyCode === 40) {
                console.log("interval on")
                setDropTime(1000 / (level + 1));
            }
        }
    }

    const dropPlayer = () => {
        console.log("interval off")
        setDropTime(null);
        drop();

    }

    const move = ({keyCode}) => {
        //game over== no register key press
        if(!gameOver) {
            //left arrow
            if(keyCode === 37) {
                //to the left
                movePlayer(-1)
            //right arrow
            } else if (keyCode === 39) {
                //to the right
                movePlayer(1);
             //down arrow  
            } else if (keyCode === 40) {
                dropPlayer()
            } else if (keyCode === 38) {
                playerRotate(stage, 1)
            }
        }
    }

    useInterval (() => {
        drop();
    }, dropTime)

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={event => move(event)} onKeyUp={keyUp}>
            
            <StyledTetris>
                <Stage stage={stage}/>
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text = "Game Over"/>
                    ):(
                    <div>
                        <Display text={`Score: ${score}`}/>
                        <Display text={`Rows: ${rows}`}/>
                        <Display text={`Leve: ${level}`}/>
                    </div>
                    )}
                    <StartButton callback={startGame}/>
                    <StopButton callback={stopGame}/>
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
        
    )
}
  
export default Tetris;

  