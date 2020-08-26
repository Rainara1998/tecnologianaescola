import React, { useState } from 'react';

export default function ListPessoas({dataList, removeItem = () => {}, editItem = () => {} }){
    const [openManagerActions, setOpenManagerActions] = useState(false);

    return(
        <div className='list'>
            <div className='column-main'>
                <div style={{ backgroundImage: `url(${dataList.foto})` }} className='foto-perfil-list'/>
                { dataList.nome_completo }
            </div>
            <div className='column-main'>
                <a href={dataList.link_resposta} target='_blank' rel="noopener noreferrer">
                    Ver resposta
                </a>
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
                        }}>Avaliar</button> 

                        <button onClick={() => {
                            setOpenManagerActions(false)
                            removeItem()}}
                        >Excluir Resposta</button>
                    </div>
                }
            </div>
        </div>
    )
}