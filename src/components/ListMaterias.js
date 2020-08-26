import React, { useState } from 'react';

export default function ListMaterias({dataList, removeItem = () => {}, editItem = () => {} }){
    const [openManagerActions, setOpenManagerActions] = useState(false);

    return(
        <div className='list' key={dataList.id}>
            <div className='column-main'>
                { dataList.nome_materia }
            </div>
            <div>
                { dataList.carga_horaria }
            </div>
            <div>
                Prof. { dataList.nome_completo }
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
                            removeItem()}}
                        >Excluir</button>
                    </div>
                }
            </div>
        </div>
    )
}