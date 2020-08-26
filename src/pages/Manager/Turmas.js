import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/main.css';
import Api from '../../services/Api';
import MessageComponent from '../../components/Message';
import ListTurmas from '../../components/ListTurmas';
import ModalTurmas from '../../components/ModalTurmas';

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
                const response = await Api.get(`/turma/list/${escola_id}/`);
                const { content } = response.data;

                if(!content.length) newMessage({ content: 'Nenhuma turma encontrada nesta escola!' })
                else newList(content);

            } catch (error) {
                if(error.response) newMessage({ content: error.response.data.message })
                else newMessage({ content: error.message })
            }
        })()
    },[escola_id])

    function onCloseModal(content){
        if(content !== undefined){
            const { isNewItem, ...rest } = content;
            if(!isNewItem) newList(prevList => prevList.map(item =>  item.id === rest.id ? rest : item))
            else newList(prevList => [...prevList, rest])
        }

        handleModal({ open: false, data: {} })
    }

    async function removeItem(id){
        newMessage({ content: 'Deletando Turma...', type: 'success' })
        try {
            const response = await Api.delete(`/turma/delete/${id}`);
            const { message } = response.data;
            newMessage({ content: message, type: 'success' });
            newList(prevList => prevList.filter(item => item.id !== id))

        } catch (error) {
            if(error.response)
            newMessage({ content: error.response.data.message })
            else
            newMessage({ content: error.message })
        }
    }

    return(
        <>
        <Header add={true} openModal={() => handleModal({ open: true, data: {}})}/>
        <div className={`box-control-atividade`}>
            <div className="box-pattern">
                <h1 className='titleLists'>{ list.length } turmas encontradas</h1>
                {
                    list.map(data => <ListTurmas
                        key={data.id}
                        dataList={data}
                        editItem={() => handleModal({ open: true, data: data })}
                        removeItem={() => removeItem(data.id)}
                    />)
                }
            </div>
        </div>
        <MessageComponent message={message} />
        {
            !modal.open ? <></> : 
            <ModalTurmas dataInitial={modal.data} closeModal={content => onCloseModal(content)} Message={contentMessage => newMessage(contentMessage)}/>
        }
        </>
    )
}