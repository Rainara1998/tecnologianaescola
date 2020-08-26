import React, { useState, createContext, useEffect } from 'react';

const TurmaContext = createContext();

const TurmaProvider = ({ children }) => {
    const [ infoTurma, handleTurma ] = useState({
        turma_id: null,
        nome_turma: null,
        turno: null,
        escola: null,
    });

    useEffect(() => {
        const infoTurma = localStorage.getItem('infoTurma');
        if(infoTurma){
            handleTurma(JSON.parse(infoTurma))
        }
    },[])

    function addTurma(data){
        handleTurma(data);
        localStorage.setItem('infoTurma', JSON.stringify(data))
    }

    function removeTurma(){
        handleTurma({
            turma_id: null,
            nome_turma: null,
            turno: null,
            escola: null,
        })
    }
    return(
        <TurmaContext.Provider value={{ infoTurma, addTurma, removeTurma }}>
            { children }
        </TurmaContext.Provider>
    )
}

export { TurmaContext, TurmaProvider }