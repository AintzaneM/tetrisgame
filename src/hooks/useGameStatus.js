import { useState, useEffect, useCallback } from "react";

export const useGameStatus = rowsCleared => {


    const[score, setScore] = useState(0);
    const[rows, setRows] = useState(0);
    const[level, setLevel] = useState(0);

    const linePoints = [40, 100, 300, 1200];

    const calcScore = useCallback(()=> {
        //check if we have score
        if(rowsCleared>0) {
            setScore(prevState => prevState + linePoints[rowsCleared -1]*(level+1));
            setRows(prevState => prevState + rowsCleared);
        }
    }, [level, linePoints, rowsCleared]);

    useEffect (()=> {
        calcScore();

    }, [calcScore, rowsCleared, score])

    return [score,setScore, rows, setRows, level, setLevel]
}

