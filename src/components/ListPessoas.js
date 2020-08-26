import React, { useState } from 'react';

export default function ListPessoas({dataList, removeItem = () => {}, editItem = () => {} }){
    const [openManagerActions, setOpenManagerActions] = useState(false);

    return(
        <div className='list' key={dataList.id}>
            <div className='column-main'>
                <div style={{ backgroundImage: `url(${dataList.foto})` }} className='foto-perfil-list'/>
                { dataList.nome_completo }
            </div>
            <div>
                { dataList.type_access }
            </div>
            <div className="manager-atividade">
                <button className="btn-open-box-manager" onClick={() => setOpenManagerActions(!openManagerActions)}>
                    <div></div>
                    <div></div>
                    <div></div>
                </button>
                {
                    !openManagerActions ? <></> : 
                    <div className="btn-actions-manager">
                        <button onClick={() => {
                            setOpenManagerActions(false)
                            editItem()
                        }}>Editar</button>
                        <button onClick={() => {
                            setOpenManagerActions(false)
                            removeItem(dataList.person_id)}}
                        >Excluir</button>
                    </div>
                }
            </div>
        </div>
    )
}