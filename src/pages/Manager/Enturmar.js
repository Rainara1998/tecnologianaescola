import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/main.css';
import Api from '../../services/Api';
import MessageComponent from '../../components/Message';
import ListEnturmacao from '../../components/ListEnturmacao';
import ModalEnturmar from '../../components/ModalEnturmar';

export default function Turmas(){
    const { escola_id } = useParams();
    const [list, newList] = useState([]);
    const [message, newMessage] = useState(null);
    const [modal, handleModal] = useState({
        open: false,
        data: {}
    });
    
    useEffect(() => {
        (async ()=>{
            try {
                const response = await Api.get(`/turma/enturmar/escola/${escola_id}/`);
                const { content } = response.data;

                if(!content.length)
                newMessage({ content: 'Nenhum aluno encontrado!' })

                else
                newList(content);

            } catch (error) {
                if(error.response)
                newMessage({ content: error.response.data.message })
                else
                newMessage({ content: error.message })
            }
        })()
    },[escola_id])

    function onCloseModal(content){
        if(content !== undefined){
            newList(prevList => 
                prevList.map(item => {
                    return item.pessoa === content.pessoa ? content : item
                })
            )
        }

        handleModal({ open: false, data: {} })
    }
    async function removeItem(data){
        newMessage({ content: 'Desenturmando...', type: 'success' })
        try {
            const response = await Api.delete(`/turma/enturmar/delete/${data.id}`);
            const { message } = response.data;
            newMessage({ content: message, type: 'success' });

            newList(prevList => prevList.map(item => item.id !== data.id ? item : Object.assign(data, {
                id: null,
                turma: null,
                nome_turma: null,
                turno: null,
                ano_letivo: null
            })))

        } catch (error) {
            if(error.response)
            newMessage({ content: error.response.data.message })
            else
            newMessage({ content: error.message })
        }
    }

    return(
        <>
        <Header/>
        <div className={`box-control-atividade`}>
            <div className="box-pattern">
                <h1 className='titleLists'>{ list.length } alunos</h1>
                {
                    list.map(data => <ListEnturmacao
                        key={data.pessoa}
                        dataList={data}
                        editItem={() => handleModal({ open: true, data: data})}
                        removeItem={() => removeItem(data)}
                    />)
                }
            </div>
        </div>
        <MessageComponent message={message} />
        {
            !modal.open ? <></> : 
            <ModalEnturmar dataInitial={modal.data} closeModal={content => onCloseModal(content)} Message={contentMessage => newMessage(contentMessage)}/>
        }
        </>
    )
}