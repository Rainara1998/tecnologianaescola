import React, { useState, createContext, useEffect } from 'react';

const EscolaContext = createContext();

const EscolaProvider = ({ children }) => {
    const [ infoEscola, handleEscola ] = useState({
        id: null,
        nome_escola: null,
    });

    useEffect(() => {
        const escola = localStorage.getItem('infoEscola');
        if(escola){
            handleEscola(JSON.parse(escola))
        }
    },[])

    function addEscola(data){
        handleEscola(data);
        localStorage.setItem('infoEscola', JSON.stringify(data))
    }

    function removeEscola(){
        handleEscola({
            id: null,
            nome_escola: null,
        })
    }
    return(
        <EscolaContext.Provider value={{ infoEscola, addEscola, removeEscola }}>
            { children }
        </EscolaContext.Provider>
    )
}

export { EscolaContext, EscolaProvider }