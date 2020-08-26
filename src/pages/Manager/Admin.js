import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/main.css';
import Api from '../../services/Api';
import MessageComponent from '../../components/Message';
import ListPessoas from '../../components/ListPessoas';
import ModalPessoa from '../../components/ModalPessoa';

export default function Pessoas(){
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
                const response = await Api.get(`/person/admin/`);
                const { content } = response.data;

                if(!content.length) newMessage({ content: 'Nenhum administrador encontrado!' })
                else newList(content);

            } catch (error) {
                newMessage({ content: error.response.data.message || error.message })
            }
        })()
    },[escola_id])

    function onCloseModal(content){
        if(content !== undefined){
            const { isNewItem, ...rest } = content;
            if(!isNewItem) newList(prevList => prevList.map(item => item.id === rest.id ? rest : item));
            else newList(prevList => [...prevList, rest])
        }

        handleModal({ open: false, data: {} })
    }

    async function removeItem(id){
        newMessage({ content: 'Deletando Pessoa...', type: 'success' })
        try {
            const response = await Api.delete(`/person/delete/${id}`);
            const { message } = response.data;
            newMessage({ content: message, type: 'success' });
            newList(prevList => prevList.filter(item => item.person_id !== id))

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
                <h1 className='titleLists'>{ list.length } pessoas encontradas</h1>
                {
                    list.map(data => <ListPessoas
                        key={data.person_id}
                        dataList={data}
                        editItem={() => handleModal({ open: true, data: data, isNewItem: false})}
                        removeItem={idItem => removeItem(idItem)}
                    />)
                }
            </div>
        </div>
        <MessageComponent message={message} />
        {
            !modal.open ? <></> : 
            <ModalPessoa dataInitial={modal.data} isNewItem={modal.isNewItem} closeModal={content => onCloseModal(content)} Message={contentMessage => newMessage(contentMessage)}/>
        }
        </>
    )
}