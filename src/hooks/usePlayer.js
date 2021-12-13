import {useState, useCallback} from 'react';
import { checkCollision, STAGE_WIDTH } from '../components/gameHelpers';
import { TETROMINOS ,randomTetromino } from '../components/tetrominos';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        position: {x: 0, y: 0},
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });

    const rotate = (matrix, direction) => {
        //make rows=> become colomns (traspose)
        const rotatedTetro = matrix.map((_, index) => matrix.map(column => column[index]));
        //reverse each row to get a rotated matrix(tetromino)
        if(direction > 0) {
            return rotatedTetro.map(row=>row.reverse());
        }
        return rotatedTetro.reverse()

    }

    const playerRotate = (stage, direction) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);
        const position = clonedPlayer.position.x;
        let offset = 1;
        while(checkCollision(clonedPlayer, stage, {x: 0, y:0})) {
            clonedPlayer.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if(offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -direction);
                clonedPlayer.position.x = position;
                return
            }
        }
        setPlayer(clonedPlayer)

    }

    const updatePlayerPosition = ({ x, y, collided}) => {
        setPlayer(prevState => ({
            ...prevState,
            position: {x: (prevState.position.x += x), y: (prevState.position.y += y)},
            collided,
        }))
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            position: {x: STAGE_WIDTH / 2 -2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false,
        })
    }, [])


    const stopPlayer = useCallback(() => {
        setPlayer({
            position: {x: -5, y:0},
            tetromino: TETROMINOS[0].shape,
            collided: false
        })

        
    }, [])
   
    return [player, updatePlayerPosition, resetPlayer, playerRotate, stopPlayer]
  
}