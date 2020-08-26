import React, { useState, useEffect, useContext } from 'react';
import "../styles/login.css";
import "../styles/main.css";
import Api from '../services/Api';
import Message from './Message';
import { useHistory } from 'react-router-dom';
import { EscolaContext } from '../context/Escola';
import { AuthContext } from '../context/Auth';
import ModalEscola from './ModalEscola';

export default function SelecionarEscola(){
    const [list, newList] = useState([]);
    const [messageErr, newMessage] = useState(null);
    const NavigatorHistory = useHistory();
    const { addEscola } = useContext(EscolaContext);
    const { userDetail:{ userInfo }, logout } = useContext(AuthContext)
    const [modal, handleModal] = useState({
        open: false,
        data: {}
    });

    useEffect(() => {
       (async () => {
           try {
               const urlApi = userInfo.type_access === "admin" ? '/escola/list/': `/lotacao/funcionario/i/`
               const response = await Api.get(urlApi);
               const { content } = response.data;

               if(!content.length)
               newMessage({ content: 'Nenhuma escola encontrada!' })

               else
               newList(content);
           } catch (error) {
               if(error.response !== undefined)
               newMessage({ content: error.response.data.message })

               else
               newMessage({ content: error.message })
           }
       })() 
    },[userInfo.type_access])

    function playTurma(data){
        const dataEscola = {
            id: data.id,
            nome_escola: data.nome_escola,
        }
        addEscola(dataEscola);
        NavigatorHistory.push(`/gerenciar/${data.id}`)
    }

    function onCloseModal(content){
        if(content !== undefined){
            const { isNewItem, ...rest } = content;
            if(isNewItem)
            newList(prevList => [...prevList, rest])
        }

        handleModal({ open: false, data: {} })
    }

    return(
        <>
        <div className='body'>
        <div className="box-login">
            <div className="box-content-pattern-login">
                <h2 className="titlePrimary" style={{ marginBottom: 20, textAlign: 'center'}}>Selecione uma escola</h2>
                <button className='cadastrar' onClick={() => handleModal({ open: true, data: {} })}>
                    Adicionar Escola
                </button>
                <div className='content'>
                {
                    !list.length ? <></> : 
                    list.map((item) => {
                        const { id, nome_escola } = item;
                        return (
                            <button key={id} className='btnTurmas' onClick={() => playTurma(item)}>
                                <div className='name'>
                                    {nome_escola}
                                </div>
                            </button>
                        )}
                    )
                }
                    <button className='btnSubmit' onClick={() => logout()}>Sair</button>
                </div>
            </div>
        </div>
        </div>
        <Message message={messageErr}/>
        {
            !modal.open ? <></> : 
            <ModalEscola dataInitial={modal.data} isNewItem={true} closeModal={content => onCloseModal(content)} Message={contentMessage => newMessage(contentMessage)}/>
        }
        </>
    )
}