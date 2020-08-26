import React, { useState } from 'react';

export default function ListPessoas({dataList, removeItem = () => {}, editItem = () => {} }){
    const [openManagerActions, setOpenManagerActions] = useState(false);

    return(
        <div className='list'>
            <div className='column-main'>
                { dataList.nome_completo }
            </div>
            <div>
                { dataList.turma === null || dataList.turma === '' ? 'Desenturmado' : `${dataList.nome_turma} - ${dataList.turno}` }
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
                        { dataList.id === null ? 
                            <button onClick={() => {
                                setOpenManagerActions(false)
                                editItem()
                            }}>Enturmar</button> : 

                            <button onClick={() => {
                                setOpenManagerActions(false)
                                removeItem()}}
                            >Desenturmar</button>
                        }
                    </div>
                }
            </div>
        </div>
    )
}