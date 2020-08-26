import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

export default function ListPessoas({dataList, removeItem = () => {}, editItem = () => {} }){
    const [openManagerActions, setOpenManagerActions] = useState(false);
    const HistoryNavigator = useHistory();
    const { escola_id } = useParams();

    return(
        <div className='list' key={dataList.id}>
            <div className='column-main'>
                { dataList.nome_turma }
            </div>
            <div>
                { dataList.turno }
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
                        <button onClick={() => HistoryNavigator.push(`/gerenciar/${escola_id}/turmas/${dataList.id}/materias/`)}>Matérias</button>
                        <button onClick={() => HistoryNavigator.push(`/sala/${dataList.id}`)}>Ir para sala</button>
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