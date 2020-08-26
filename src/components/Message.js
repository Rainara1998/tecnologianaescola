import React, { useState, useEffect } from 'react';
import iconClose from '../assets/icon-close-white.svg';
import { useHistory } from 'react-router-dom';

export default function Message({ message }){
    const [listMessage, setListMessage] = useState([]);
    const NavigatorHistory = useHistory();

    function removeMessage(idMessage){
        setListMessage(removeListMessage => removeListMessage.filter( list => list.idMessage !== idMessage ))
    }

    useEffect(() => {
        if(message !== null){
            if(message.content === 'redirect') return NavigatorHistory.replace('/login');

            const idMessage = new Date().getTime();
            const newMessage = {
                idMessage: idMessage,
                message: message.content === 'Network Error' ? 'Erro grave! Impossível se conectar ao servidor!' : message.content ,
                type: message.type || 'error'
            }

            setListMessage(list => [newMessage, ...list])
        }
    }, [message, NavigatorHistory]);

    return(
        <>
        {
           !listMessage.length ?  <></> : 
           <div className="box-control-message">
               {
                   listMessage.map(({ message, type, idMessage }) => (
                        <div className={`message ${type}`} key={idMessage}>
                            {message}
                            <button className='btnClose' onClick={() => removeMessage(idMessage)}>
                                <img src={iconClose} alt='Fechar' />
                            </button>
                        </div>
                    ))
               }
           </div>
        }
        </>
    )
}