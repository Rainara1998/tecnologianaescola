import React, { useState } from 'react';

export default function List({dataList, removeItem = () => {}, editItem = () => {} }){
    const [openManagerActions, setOpenManagerActions] = useState(false);

    return(
        <div className='list' key={dataList.id}>
            <div className='column-main'>
                { dataList.nome_escola }
            </div>
            <div>
                { dataList.municipio }
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
                            removeItem(dataList.id)}}
                        >Excluir</button>
                    </div>
                }
            </div>
        </div>
    )
}