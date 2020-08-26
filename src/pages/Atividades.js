import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import '../styles/main.css';
import Api from '../services/Api';
import MessageComponent from '../components/Message';
import { useParams } from 'react-router-dom';
import ListAtividade from '../components/ListAtividade';
import ModalAtividade from '../components/ModalAtividade';
import ModalResposta from '../components/ModalResposta';
import { AuthContext } from '../context/Auth';
import { dateCurrent } from '../components/Date';
import ModalComentarios from '../components/ModalComentarios';

export default function Escolas(){
    const { userDetail: { userInfo } } = useContext(AuthContext);
    const [list, newList] = useState([]);
    const [message, newMessage] = useState(null);
    const { materia_id } = useParams();
    const [modal, handleModal] = useState({
        open: false,
        data: {}
    });

    const [modalResposta, handleModalResposta] = useState({
        open: false,
        id_atividade: null
    });

    const [modalComentario, handleModalComentario] = useState({
        open: false,
        id_atividade: null
    });
    
    useEffect(() => {
        (async ()=>{
            try {
                const response = await Api.get(`/atividade/list/${materia_id}?agendada=${dateCurrent()}`);
                const { content } = response.data;

                if(!content.length) newMessage({ content: 'Nenhuma atividade encontrada!' })
                else newList(content);

            } catch (error) {
                if(error.response) newMessage({ content: error.response.data.message });
                else newMessage({ content: error.message });
            }
        })()
    },[materia_id])

    function onCloseModal(content){
        if(content !== undefined){
            const { isNewItem, ...rest } = content;
            if(!isNewItem) newList(prevList => prevList.map(item => item.id === rest.id ? rest : item))
            else newList(prevList => [rest, ...prevList])
        }

        handleModal({ open: false, data: {} })
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

    return(
        <>
        <Header add={userInfo.type_access !== 'aluno' ? true : false} openModal={() => handleModal({ open: true, data: {} })}/>
        <div className={`box-control-atividade`}>
            {
                list.map(data => <ListAtividade
                    key={data.id}
                    dataList={data}
                    editItem={() => handleModal({ open: true, data: data})}
                    removeItem={idItem => removeItem(idItem)}
                    modalResposta={(content) => handleModalResposta({ open: true, id_atividade: content })}
                    modalComentários={(content) => handleModalComentario({ open: true, id_atividade: content })}
                    Message={contentMessage => newMessage(contentMessage)}
                />)
            }
        </div>
        <MessageComponent message={message} />
        {
            !modalComentario.open ? <></> : 
            <ModalComentarios
                id_atividade={modalComentario.id_atividade}
                closeModal={() =>  handleModalComentario({ id_atividade: null, open: false }) }
                />
        }
        {
            !modal.open ? <></> : 
            <ModalAtividade
                dataInitial={modal.data}
                closeModal={content => onCloseModal(content)}
                Message={ contentMessage => newMessage(contentMessage) }/>
        }
        {
            !modalResposta.open ? <></> : 
            <ModalResposta
                atividade={modalResposta.id_atividade}
                closeModal={() => handleModalResposta({ open: false, id_atividade: null })}
                Message={contentMessage => newMessage(contentMessage)}/>
        }
        </>
    )
}