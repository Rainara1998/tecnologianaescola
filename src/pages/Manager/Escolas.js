import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import '../../styles/main.css';
import Api from '../../services/Api';
import MessageComponent from '../../components/Message';
import { useParams, useHistory } from 'react-router-dom';
import ListEscola from '../../components/ListEscola';
import ModalEscola from '../../components/ModalEscola';

export default function Escolas(){
    const [list, newList] = useState([]);
    const [message, newMessage] = useState(null);
    const { escola_id } = useParams();
    const HistoryNavigator = useHistory();
    const [modal, handleModal] = useState({
        open: false,
        data: {}
    });
    
    useEffect(() => {
        (async ()=>{
            try {
                const response = await Api.get(`/escola/1/${escola_id}`);
                const { content } = response.data;

                if(!content.length)
                newMessage({ content: 'Nenhuma escola encontrada!' })

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
            const { isNewRegister, ...rest } = content;
            if(!isNewRegister) newList(prevList => prevList.map(item => item.id === rest.id ? rest : item))
            else newList(prevList => [...prevList, rest])
        }

        handleModal({ open: false, data: {} })
    }

    async function removeItem(id){
        newMessage({ content: 'Apagando escola...', type: 'success' })
        try {
            await Api.delete(`/escola/delete/${id}`);
            HistoryNavigator.push('/');
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
                <h1 className='titleLists'>{ list.length } escolas encontradas</h1>
                {
                    list.map(data => <ListEscola
                        key={data.id}
                        dataList={data}
                        editItem={() => handleModal({ open: true, data: data})}
                        removeItem={idItem => removeItem(idItem)}
                    />)
                }
            </div>
        </div>
        <MessageComponent message={message} />
        {
            !modal.open ? <></> : 
            <ModalEscola dataInitial={modal.data} isNewItem={false} closeModal={content => onCloseModal(content)}/>
        }
        </>
    )
}