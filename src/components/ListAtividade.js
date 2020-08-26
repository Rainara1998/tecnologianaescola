import React, { useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { dateOnly } from './Date';
import Anexos from './Anexos';
import { AuthContext } from '../context/Auth';

export default function List({ dataList, removeItem = () => {}, editItem = () => {}, modalResposta = () => {}, modalComentários = () => {}, Message = () => {} }){
    const [openManagerActions, setOpenManagerActions] = useState(false);
    const HistoryNavigator = useHistory();
    const { turma_id, materia_id } = useParams();
    const { userDetail: { userInfo } } = useContext(AuthContext);
    return(
        <>
        <div className="box-pattern atividade" key={dataList.id} id={`atividade${dataList.id}`}>
            <div className="content-atividade">
                <div className="header-atividade">
                    <div className="title-atividade">{ dataList.titulo } / { `${dataList.carga_horaria}h` }</div>
                    <div className="date-atividade">
                        { dataList.data_entrega === null || dataList.data_entrega === '' ? 'Sem data de entrega' : `Data de entrega: ${ dateOnly(dataList.data_entrega) }`}
                        {
                            userInfo.type_access === 'aluno' ? <></> : 
                            ` | Data programada para aparecer: ${ dateOnly(dataList.data_agendada) }`
                        }
                    </div>
                </div>
                <div>
                    {dataList.descricao}
                </div>
            </div>
            <Anexos id_atividade={dataList.id} Message={contentMessage => Message(contentMessage)}/>
            <div className='btnsResponder'>
                {
                    userInfo.type_access !== 'aluno' ? <></> : 
                    <button className='btnResponder' onClick={() => modalResposta(dataList.id)}>
                        Resposta
                    </button>
                }
                <button className='btnResponder responder_comentarios' onClick={() => modalComentários(dataList.id)}>
                    Comentários
                </button>
            </div>
            {
                 userInfo.type_access === 'aluno' ? <></> : 
                 <div className="manager-atividade">
                    <button className="btn-open-box-manager" onClick={() => setOpenManagerActions(!openManagerActions)}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </button>
                    {
                        !openManagerActions ? <></> : 
                        <div className="btn-actions-manager">
                            <button onClick={() => HistoryNavigator.push(`/sala/${turma_id}/materia/${materia_id}/atividade/${dataList.id}/avaliar/`)}>Ver respostas</button>
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
            }
        </div>
        </>
    )
}