import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/main.css';
import Api from '../services/Api';
import MessageComponent from '../components/Message';
import { useParams } from 'react-router-dom';
import ListAtividade from '../components/ListAtividade';
import ModalAtividade from '../components/ModalAtividade';
import ListAvaliar from '../components/ListAvaliar';
import ModalAvaliar from '../components/ModalAvaliar';

export default function Escolas(){
    const [list, newList] = useState([]);
    const [listResposta, newListResposta] = useState([]);
    const [message, newMessage] = useState(null);
    const { materia_id, atividade_id } = useParams();
    const [modal, handleModal] = useState({
        open: false,
        data: {}
    });

    const [modalBoxAvaliar, handleModalAvaliar] = useState({
        open: false,
        data: {}
    });
    
    useEffect(() => {
        (async ()=>{
            try {
                const response = await Api.get(`/atividade/list/${materia_id}/atividade/${atividade_id}`);
                const { content } = response.data;

                if(!content.length) newMessage({ content: 'Nenhuma atividade encontrada!' })
                else newList(content);

            } catch (error) {
                if(error.response) newMessage({ content: error.response.data.message })
                else newMessage({ content: error.message })
            }
        })()
    },[materia_id, atividade_id])

    useEffect(() => {
        (async ()=>{
            try {
                const response = await Api.get(`/resposta/list/${atividade_id}`);
                const { content } = response.data;

                if(!content.length) newMessage({ content: 'Nenhuma resposta encontrada nesta atividade!' })
                else newListResposta(content);

            } catch (error) {
                if(error.response) newMessage({ content: error.response.data.message })
                else newMessage({ content: error.message })
            }
        })()
    },[atividade_id])

    function onCloseModal(content){
        if(content !== undefined){
            const { isNewItem, ...rest } = content;
            if(!isNewItem) newList(prevList => prevList.map(item => item.id === rest.id ? rest : item))
        }
        handleModal({ open: false, data: {} })
    }

    function onCloseModalAvaliar(content){
        if(content !== undefined){
            const { isNewItem, ...rest } = content;
            if(!isNewItem) newListResposta(prevList => prevList.map(item => item.id === rest.id ? rest : item))
        }
        handleModalAvaliar({ open: false, data: {} })
    }

    async function removeItem(id){
        newMessage({ content: 'Apagando atividade...', type: 'success' })
        try {
            await Api.delete(`/atividade/delete/${id}`);
            newMessage({ content: "Atividade apagada com sucesso!", type: 'success' })
            newList(prevList => prevList.filter(item => item.id !== id))
            
        } catch (error) {
            if(error.response)
            newMessage({ content: error.response.data.message })
            else
            newMessage({ content: error.message })
        }
    }

    async function removeRespostaAluno(id){
        newMessage({ content: 'Apagando respota do aluno...', type: 'success' })
        try {
            await Api.delete(`/resposta/delete/${id}`);
            newMessage({ content: "Respota apagada com sucesso!", type: 'success' })
            newListResposta(prevList => prevList.filter(item => item.id !== id))
            
        } catch (error) {
            if(error.response) newMessage({ content: error.response.data.message })
            else newMessage({ content: error.message })
        }
    }

    return(
        <>
        <Header/>
        <div className={`box-control-atividade`}>
            {
                list.map(data => <ListAtividade
                    key={data.id}
                    dataList={data}
                    editItem={() => handleModal({ open: true, data: data})}
                    removeItem={idItem => removeItem(idItem)}
                />)
            }

            {
                !list.length ? <></> : 
                <div className="box-pattern">
                    <h1 className='titleLists'>{ listResposta.length } respostas encontradas</h1>
                    {
                        listResposta.map(data => <ListAvaliar
                            key={data.id}
                            dataList={data}
                            editItem={() => handleModalAvaliar({ open: true, data: data})}
                            removeItem={() => removeRespostaAluno(data.id)}
                        />)
                    }
                </div>
            }
        </div>
        <MessageComponent message={message} />
        {
            !modal.open ? <></> : 
            <ModalAtividade dataInitial={modal.data} closeModal={content => onCloseModal(content)}/>
        }

        {
            !modalBoxAvaliar.open ? <></> : 
            <ModalAvaliar dataInitial={modalBoxAvaliar.data} closeModal={content => onCloseModalAvaliar(content)}/>
        }
        </>
    )
}