import React, { useState, useEffect, useContext } from 'react';
import Api from '../services/Api';
import ListAnexo from '../components/ListAnexo';
import ModalAnexo from '../components/ModalAnexo';
import { AuthContext } from '../context/Auth';

export default function Anexo({ id_atividade, Message = () => {} }){
    const [list, newList] = useState([]);
    const [modal, handleModal] = useState(false);
    const { userDetail: { userInfo } } = useContext(AuthContext);
    
    useEffect(() => {
        (async ()=>{
            try {
                const response = await Api.get(`/anexo/list/${id_atividade}`);
                const { content } = response.data;
                newList(content);
            } catch (error) {
                console.log(error)
            }
        })()
    },[id_atividade])

    function onCloseModal(content){
        if(content !== undefined){
            newList(prevList => [...prevList, content])
        }
        handleModal(false)
    }

    async function removeItem(id){
        try {
            await Api.delete(`/anexo/delete/${id}`);
            newList(prevList => prevList.filter(item => item.id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
        <div className="anexos-atividade">
            <div className="title-anexos">
                <span>Materiais em anexo</span>
                {
                    userInfo.type_access === 'aluno' ? <></> : 
                    <button onClick={() => handleModal(true)}>
                        <img src={require('../assets/icon-add.svg')} alt=''/>
                    </button>
                }
            </div>
            <div className="list-anexos">
            {
                list.map(data => <ListAnexo
                    key={data.id}
                    dataList={data}
                    removeItem={idItem => removeItem(idItem)}
                />)
            }
            </div>
        </div>
        {
            !modal ? <></> : 
            <ModalAnexo atividade={id_atividade} closeModal={content => onCloseModal(content)} Message={contentMessage => Message(contentMessage)}/>
        }
        </>
    )
}