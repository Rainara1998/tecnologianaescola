import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/main.css';
import Api from '../../services/Api';
import MessageComponent from '../../components/Message';
import ListMaterias from '../../components/ListMaterias';
import ModalMaterias from '../../components/ModalMaterias';

export default function Materias(){
    const { turma_id } = useParams();
    const [list, newList] = useState([]);
    const [message, newMessage] = useState(null);
    const [modal, handleModal] = useState({
        open: false,
        data: {}
    });
    
    useEffect(() => {
        (async ()=>{
            try {
                const response = await Api.get(`/materia/list/${turma_id}/`);
                const { content } = response.data;

                if(!content.length)
                newMessage({ content: 'Nenhuma Matéria encontrada nesta turma!' })

                else
                newList(content);

            } catch (error) {
                if(error.response)
                newMessage({ content: error.response.data.message })
                else
                newMessage({ content: error.message })
            }
        })()
    },[turma_id])

    function onCloseModal(content){
        if(content !== undefined){
            const { isNewItem, ...rest } = content;
            if(!isNewItem)
            newList(prevList => 
                prevList.map(item => {
                    if(item.id === rest.id)
                    return rest;

                    return false;
                })
            )

            else
            newList(prevList => [...prevList, rest])
        }

        handleModal({ open: false, data: {} })
    }

    async function removeItem(id){
        newMessage({ content: 'Deletando Matéria...', type: 'success' })
        try {
            const response = await Api.delete(`/materia/delete/${id}`);
            const { message } = response.data;
            newMessage({ content: message, type: 'success' });
            newList(prevList => prevList.filter(item => item.id !== id))

        } catch (error) {
            if(error.response) newMessage({ content: error.response.data.message })
            else newMessage({ content: error.message })
        }
    }

    return(
        <>
        <Header add={true} openModal={() => handleModal({ open: true, data: {}})}/>
        <div className={`box-control-atividade`}>
            <div className="box-pattern">
                <h1 className='titleLists'>{ list.length } matérias encontradas</h1>
                {
                    list.map(data => <ListMaterias
                        key={data.id}
                        dataList={data}
                        editItem={() => handleModal({ open: true, data: data})}
                        removeItem={() => removeItem(data.id)}
                    />)
                }
            </div>
        </div>
        <MessageComponent message={message} />
        {
            !modal.open ? <></> : 
            <ModalMaterias dataInitial={modal.data} closeModal={content => onCloseModal(content)} Message={contentMessage => newMessage(contentMessage)}/>
        }
        </>
    )
}